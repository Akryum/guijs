import { addCommand } from '../command'
import { CommandType, NpmScriptStatus, Resolvers } from '@/generated/schema'
import { MetaNpmScript } from './meta-types'
import Context from '@/generated/context'
import consola from 'consola'
import gql from 'graphql-tag'

export const typeDefs = gql`
extend type NpmScript {
  status: NpmScriptStatus!
}

enum NpmScriptStatus {
  idle
  running
  success
  error
  killed
}
`

export function getScriptStatus (script: MetaNpmScript, ctx: Context): NpmScriptStatus {
  // @TODO script status
  return NpmScriptStatus.Idle
}

export const resolvers: Resolvers = {
  NpmScript: {
    // @TODO
    status: (script, args, ctx) => getScriptStatus(script, ctx),
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

    const status = getScriptStatus(script, ctx)
    if (status === NpmScriptStatus.Running) {
      // @TODO stop
    } else {
      // @TODO run
    }
  },
})
