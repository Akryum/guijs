import gql from 'graphql-tag'
import getWorkspaces from '@guijs/get-workspaces'
import path from 'path'
import { MetaProjectWorkspace } from './meta-types'
import { Resolvers } from '@/generated/schema'
import { getProjectTypes } from '../project-type'
import Context from '@/generated/context'

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
`

async function detectWorkspaces (cwd: string, projectId: string, ctx: Context): Promise<MetaProjectWorkspace[]> {
  const workspaces = await getWorkspaces({
    cwd,
  })

  if (!workspaces.some(w => w.name === 'root')) {
    workspaces.unshift(...await getWorkspaces({
      cwd,
      tools: ['root'],
    }))
  }

  const result = workspaces.map(w => {
    const relativeDir = path.relative(cwd, w.dir)
    return {
      id: !relativeDir ? '__root' : relativeDir,
      name: !w.name ? path.basename(w.dir) : w.name,
      absolutePath: w.dir,
      relativePath: relativeDir,
      typeId: '244960132405920258',
    }
  })

  // Cache workspaces
  await ctx.db.projects.update({
    _id: projectId,
  }, {
    $set: {
      workspaces: result,
    },
  })

  return result
}

export const resolvers: Resolvers = {
  ProjectWorkspace: {
    type: (workspace) => getProjectTypes().find(pt => pt.id === workspace.typeId),
  },

  Project: {
    workspaces: (project, args, ctx) => detectWorkspaces(project.path, project._id, ctx),

    workspace: async (project, { id }) => project.workspaces.find(w => w.id === id),
  },
}
