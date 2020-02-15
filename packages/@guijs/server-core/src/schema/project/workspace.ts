import gql from 'graphql-tag'
import getWorkspaces from '@guijs/get-workspaces'
import path from 'path'
import fs from 'fs-extra'
import { MetaProjectWorkspace, MetaProject } from './meta-types'
import { Resolvers, CommandType } from '@/generated/schema'
import { getProjectTypes } from '../project-type'
import Context from '@/generated/context'
import { addKeybinding } from '../keybinding'
import { addCommand } from '../command'

export const typeDefs = gql`
type ProjectWorkspace {
  id: ID!
  name: String!
  absolutePath: String!
  relativePath: String!
  type: ProjectType!
}

extend type Project {
  workspaces: [ProjectWorkspace!]!
  workspace (id: ID!): ProjectWorkspace
}

extend type Mutation {
  editProjectWorkspace (input: EditProjectWorkspaceInput!): ProjectWorkspace
}

input EditProjectWorkspaceInput {
  projectId: ID!
  workspaceId: ID!
  name: String!
  typeId: ID!
}
`

export async function detectWorkspaces (project: MetaProject, ctx: Context) {
  const workspaces = await getWorkspaces({
    cwd: project.path,
  })

  if (!workspaces.some(w => w.name === 'root')) {
    workspaces.unshift(...await getWorkspaces({
      cwd: project.path,
      tools: ['root'],
    }))
  }

  const result: MetaProjectWorkspace[] = workspaces.map(w => {
    const relativeDir = path.relative(project.path, w.dir)
    return {
      id: !relativeDir ? '__root' : relativeDir,
      name: !w.name ? path.basename(w.dir) : w.name,
      absolutePath: w.dir,
      relativePath: relativeDir,
      typeId: '244960132405920258',
    }
  })

  // Use existing data
  if (project.workspaces) {
    for (const workspace of result) {
      const existing = project.workspaces.find(w => w.id === workspace.id)
      if (existing) {
        Object.assign(workspace, existing)
      }
    }
  }

  // Cache workspaces
  await ctx.db.projects.update({
    _id: project._id,
  }, {
    $set: {
      workspaces: result,
    },
  })

  return result
}

export async function getProjectWorkspace (project: MetaProject, workspaceId: string, ctx: Context) {
  if (!project.workspaces) {
    project.workspaces = await detectWorkspaces(project, ctx)
  }
  return project.workspaces.find(w => w.id === workspaceId)
}

export const resolvers: Resolvers = {
  ProjectWorkspace: {
    type: (workspace) => getProjectTypes().find(pt => pt.id === workspace.typeId),
  },

  Project: {
    workspaces: (project, args, ctx) => detectWorkspaces(project, ctx),

    workspace: async (project, { id }, ctx) => getProjectWorkspace(project, id, ctx),
  },

  Mutation: {
    editProjectWorkspace: async (root, { input }, ctx) => {
      const project: MetaProject = await ctx.db.projects.findOne({ _id: input.projectId })
      if (!project) {
        throw new Error(`Project ${input.projectId} not found`)
      }

      const workspace = await getProjectWorkspace(project, input.workspaceId, ctx)
      if (!workspace) {
        throw new Error(`Workspace ${input.workspaceId} not found`)
      }

      // Update DB

      const index = project.workspaces.indexOf(workspace)

      await ctx.db.projects.update({
        _id: input.projectId,
      }, {
        $set: {
          [`workspaces.${index}.name`]: input.name,
          [`workspaces.${index}.typeId`]: input.typeId,
        },
      })

      Object.assign(workspace, {
        name: input.name,
        typeId: input.typeId,
      })

      // Update package.json

      const pkgFile = path.join(workspace.absolutePath, 'package.json')
      const pkg = await fs.readJson(pkgFile)
      pkg.name = input.name
      await fs.writeJson(pkgFile, pkg, {
        spaces: 2,
      })

      return workspace
    },
  },
}

addKeybinding({
  id: 'workspace-select',
  scope: 'root',
  sequences: ['w'],
})

addCommand({
  id: 'edit-workspace',
  type: CommandType.Action,
  label: 'Edit current workspace',
  description: 'guijs.edit-workspace.edit-current-workspace',
  icon: 'edit',
  filter: (cmd, ctx) => !!ctx.getProjectId(),
})
