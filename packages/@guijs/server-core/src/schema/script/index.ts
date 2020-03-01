import { addCommand, removeCommands, commands, runCommand } from '../command'
import { CommandType, Resolvers, NpmScriptStatus } from '@/generated/schema'
import { addKeybinding } from '../keybinding'
import gql from 'graphql-tag'
import fs from 'fs-extra'
import path from 'path'
import shortid from 'shortid'
import { MetaProjectWorkspace, MetaProject } from '../project/meta-types'
import Context from '@/generated/context'
import { MetaNpmScript } from './meta-types'
import { onProjectOpen } from '../project/open'
import { detectWorkspaces, getProjectWorkspace } from '../project/workspace'
import { onProjectClose } from '../project/close'
import { hook } from '@nodepack/app-context'

export const typeDefs = gql`
type NpmScript implements Document {
  id: ID!
  name: String!
  command: String!
}

extend type ProjectWorkspace {
  scripts: [NpmScript!]!
}

extend type Query {
  script (id: ID!): NpmScript
}

extend type Subscription {
  npmScriptUpdated: NpmScript
}
`

async function findScripts (workspace: MetaProjectWorkspace, ctx: Context) {
  const pkg = await fs.readJson(path.join(workspace.absolutePath, 'package.json'))
  if (pkg.scripts) {
    const result: MetaNpmScript[] = []
    for (const key in pkg.scripts) {
      result.push({
        _id: shortid(),
        projectId: ctx.getProjectId(),
        workspaceId: workspace.id,
        name: key,
        command: pkg.scripts[key],
        status: NpmScriptStatus.Idle,
      })
    }
    return result
  }
  return []
}

async function loadScripts (workspace: MetaProjectWorkspace, ctx: Context) {
  const result: MetaNpmScript[] = []

  const projectId = ctx.getProjectId()

  // Clear script commands
  removeCommands(commands.filter(cmd => cmd.projectId === projectId &&
    cmd.type === CommandType.Script &&
    cmd.related.workspaceId === workspace.id))

  const oldScripts: MetaNpmScript[] = await ctx.db.scripts.find({
    projectId: projectId,
    workspaceId: workspace.id,
  })
  const oldScriptMap = new Map<string, MetaNpmScript>()
  for (const script of oldScripts) {
    oldScriptMap.set(script.name, script)
  }

  // Compare scanned and old
  const scannedScripts = await findScripts(workspace, ctx)
  const newScripts: MetaNpmScript[] = []
  const updatedScripts: MetaNpmScript[] = []
  for (const script of scannedScripts) {
    if (oldScriptMap.has(script.name)) {
      result.push(oldScriptMap.get(script.name))
      oldScriptMap.delete(script.name)
      updatedScripts.push(script)
    } else {
      result.push(script)
      newScripts.push(script)
    }
  }

  // Insert new scripts
  await ctx.db.scripts.insert(newScripts)

  // Update scripts
  for (const script of updatedScripts) {
    await ctx.db.scripts.update({
      _id: script._id,
    }, {
      $set: script,
    })
  }

  // Clean old deleted
  for (const [, script] of oldScriptMap) {
    if (script.status === NpmScriptStatus.Idle) {
      await ctx.db.scripts.remove({
        _id: script._id,
      }, {})
    } else {
      script.deleted = true
      await ctx.db.scripts.update({
        _id: script._id,
      }, {
        $set: { deleted: true },
      })
      result.push(script)
    }
  }

  // Commands
  for (const script of result) {
    // Commands
    addCommand({
      id: `script-${shortid()}`,
      type: CommandType.Script,
      label: script.name,
      description: workspace.name,
      projectId: projectId,
      related: {
        workspaceId: workspace.id,
      },
      handler: (cmd, payload, ctx) => {
        runCommand('toggle-run-script', {
          projectId: projectId,
          workspaceId: workspace.id,
          scriptId: script._id,
        }, ctx)
      },
    })
  }

  return result
}

export async function getScriptWorkspace (script: MetaNpmScript, ctx: Context) {
  const project = await ctx.db.projects.findOne<MetaProject>({ _id: script.projectId })
  const workspace = await getProjectWorkspace(project, script.workspaceId, ctx)
  return {
    project,
    workspace,
  }
}

export const resolvers: Resolvers = {
  ProjectWorkspace: {
    scripts: async (workspace, args, ctx) => loadScripts(workspace, ctx),
  },

  Query: {
    script: async (root, { id }, ctx) => ctx.db.scripts.findOne<MetaNpmScript>({ _id: id }),
  },

  Subscription: {
    npmScriptUpdated: {
      subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator(['scriptUpdated']),
    },
  },
}

addCommand({
  id: 'show-scripts',
  type: CommandType.Action,
  label: 'Show scripts',
  description: 'guijs.script.show-scripts',
})

addKeybinding({
  id: 'show-scripts',
  scope: 'root',
  sequences: ['s'],
})

onProjectOpen(async (project, ctx) => {
  // Scan workspaces to index packages
  const workspaces = await detectWorkspaces(project, ctx)
  for (const workspace of workspaces) {
    await loadScripts(workspace, ctx)
  }
})

onProjectClose(async (project) => {
  // Clear package commands
  removeCommands(commands.filter(cmd => cmd.projectId === project._id &&
    cmd.type === CommandType.Script))
})

hook('apolloSchema', async (ctx: Context) => {
  // Reset scripts
  await ctx.db.scripts.update({}, {
    $set: {
      status: NpmScriptStatus.Idle,
    },
  }, {
    multi: true,
  })
})
