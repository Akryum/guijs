import { addCommand } from '../command'
import { CommandType, NpmScriptStatus, Resolvers } from '@/generated/schema'
import { MetaNpmScript } from './meta-types'
import Context from '@/generated/context'
import consola from 'consola'
import gql from 'graphql-tag'
import { createTerminal, Terminal, terminals } from '../terminal/server'
import { MetaProject } from '../project/meta-types'
import { getProjectWorkspace } from '../project/workspace'
import { addKeybinding } from '../keybinding'

export const typeDefs = gql`
extend type NpmScript {
  status: NpmScriptStatus!
  terminal: Terminal
}

enum NpmScriptStatus {
  idle
  running
  success
  error
  killed
}

extend type Mutation {
  runScript (input: RunScriptInput!): NpmScript
  stopScript (input: StopScriptInput!): NpmScript
}

input RunScriptInput {
  scriptId: ID!
}

input StopScriptInput {
  scriptId: ID!
}
`

export function getScriptTerminal (script: MetaNpmScript) {
  return terminals.find(t => t.name === script._id)
}

export async function ensureScriptTerminal (script: MetaNpmScript, ctx: Context) {
  const project = await ctx.db.projects.findOne<MetaProject>({ _id: script.projectId })
  const workspace = await getProjectWorkspace(project, script.workspaceId, ctx)

  let terminal: Terminal = getScriptTerminal(script)

  if (!terminal) {
    terminal = createTerminal({
      name: script._id,
      title: script.name,
      cwd: workspace.absolutePath,
      hidden: true,
    })

    terminal.on('exit', async (exitCode) => {
      if (terminal.killed) return
      if (exitCode === 0) {
        await setScriptStatus(script, NpmScriptStatus.Success, ctx)
      } else {
        await setScriptStatus(script, NpmScriptStatus.Error, ctx)
      }
    })
  }

  return terminal
}

export async function runScript (script: MetaNpmScript, ctx: Context) {
  const terminal = await ensureScriptTerminal(script, ctx)
  terminal.run('npm', [
    'run',
    script.name,
    '--scripts-prepend-node-path',
  ])
  await setScriptStatus(script, NpmScriptStatus.Running, ctx)
}

export async function stopScript (script: MetaNpmScript, ctx: Context) {
  const terminal = getScriptTerminal(script)
  if (terminal) {
    await terminal.kill(true)
    await setScriptStatus(script, NpmScriptStatus.Killed, ctx)
  }
}

export async function setScriptStatus (script: MetaNpmScript, status: NpmScriptStatus, ctx: Context) {
  script.status = status
  await ctx.db.scripts.update({
    _id: script._id,
  }, {
    $set: {
      status,
    },
  })
  await ctx.pubsub.publish('scriptUpdated', {
    npmScriptUpdated: script,
  })
}

export const resolvers: Resolvers = {
  NpmScript: {
    terminal: (script) => getScriptTerminal(script),
  },

  Mutation: {
    runScript: async (root, { input }, ctx) => {
      const script = await ctx.db.scripts.findOne<MetaNpmScript>({ _id: input.scriptId })
      if (script) {
        await runScript(script, ctx)
      }
      return script
    },

    stopScript: async (root, { input }, ctx) => {
      const script = await ctx.db.scripts.findOne<MetaNpmScript>({ _id: input.scriptId })
      if (script) {
        await stopScript(script, ctx)
      }
      return script
    },
  },
}

addCommand({
  id: 'toggle-run-script',
  type: CommandType.Action,
  label: 'Toggle Run Script',
  hidden: true,
  handler: async (cmd, payload, ctx) => {
    const script = await ctx.db.scripts.findOne<MetaNpmScript>({ _id: payload.scriptId })
    if (!script) {
      consola.warn(`Script ${payload.scriptId} not found`)
      return
    }

    if (script.status === NpmScriptStatus.Running) {
      await stopScript(script, ctx)
    } else {
      await runScript(script, ctx)
    }
  },
})

addKeybinding({
  id: 'toggle-run-current-script',
  scope: 'script-view',
  sequences: ['space'],
})
