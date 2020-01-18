import gql from 'graphql-tag'
import lunr from 'elasticlunr'
import consola from 'consola'
import { withFilter } from 'apollo-server-express'
import { Resolvers, CommandType } from '@/generated/schema'
import Context from '@/generated/context'
import { MetaCommand } from './meta-types'
import { keybindings, addKeybinding } from '../keybinding'

export const typeDefs = gql`
type Command {
  id: ID!
  type: CommandType!
  label: String!
  icon: String
  description: String
  keybinding: Keybinding
}

enum CommandType {
  help
  action
  project
  package
  config
  script
}

extend type Query {
  searchCommands(text: String!): [Command!]!
  command (id: ID!): Command
}

extend type Mutation {
  runCommand(input: RunCommandInput!): Command
}

input RunCommandInput {
  id: ID!
  payload: JSON
}

type Subscription {
  commandRan: CommandRan
}

type CommandRan {
  command: Command!
  payload: JSON
}
`

export const commands: MetaCommand[] = []
export const commandsMap: Map<string, MetaCommand> = new Map()

function createIndex () {
  return lunr<MetaCommand>(function () {
    this.addField('label')
    this.setRef('id')
    this.saveDocument(false)
  })
}

const searchIndexes: {[key in CommandType]?: lunr.Index<MetaCommand>} = {}
for (const key in CommandType) {
  searchIndexes[CommandType[key]] = createIndex()
}
const globalSearchIndex = createIndex()

export function addCommand (cmd: MetaCommand) {
  commands.push(cmd)
  commandsMap.set(cmd.id, cmd)
  if (!cmd.hidden) {
    searchIndexes[cmd.type].addDoc(cmd)
    globalSearchIndex.addDoc(cmd)
  }
}

export function updateCommand (id: string, info: Omit<Partial<MetaCommand>, 'id' | 'hidden'>) {
  const cmd = commands.find(c => c.id === id)
  if (cmd) {
    Object.assign(cmd, info)
    if (!cmd.hidden) {
      searchIndexes[cmd.type].updateDoc(cmd)
      globalSearchIndex.updateDoc(cmd)
    }
  } else {
    consola.warn(`Command ${id} not found`)
  }
}

export function removeCommand (id: string) {
  const index = commands.findIndex(c => c.id === id)
  if (index !== -1) {
    const cmd = commands[index]
    commands.splice(index, 1)
    commandsMap.delete(cmd.id)
    if (!cmd.hidden) {
      searchIndexes[cmd.type].removeDocByRef(cmd.id)
      globalSearchIndex.removeDocByRef(cmd.id)
    }
  } else {
    consola.warn(`Command ${id} not found`)
  }
}

const typeWords = {
  '?': CommandType.Help,
  '>': CommandType.Action,
  '<': CommandType.Project,
  '&': CommandType.Package,
  '~': CommandType.Config,
  '$': CommandType.Script,
}

const typeWordReg = new RegExp(`^(${Object.keys(typeWords).map(w => `\\${w}`).join('|')})`)

function getSeachType (text: string) {
  const result = typeWordReg.exec(text)
  if (result) {
    return typeWords[result[1]]
  }
  return null
}

export function searchCommands (text: string) {
  let searchIndex = globalSearchIndex
  const type = getSeachType(text)
  if (type) {
    searchIndex = searchIndexes[type]
    text = text.substr(1)
  }

  if (!text.length) {
    return getRecentCommands(type)
  }

  const results = searchIndex.search(text, {
    fields: {
      label: { boost: 2, expand: true },
    },
  })
  return results.map(r => commandsMap.get(r.ref))
}

export function getRecentCommands (type: string = null, maxCount = 20) {
  let list = commands
  if (type) {
    list = list.filter(c => !c.hidden && c.type === type)
  } else {
    list = list.filter(c => !c.hidden && c.type !== CommandType.Help).slice()
  }
  list.sort((a, b) => {
    if (a.lastUsed && b.lastUsed) {
      return b.lastUsed.getTime() - a.lastUsed.getTime()
    } else if (a.lastUsed) {
      return -1
    } else if (b.lastUsed) {
      return 1
    }
    return 0
  })
  return list.slice(0, maxCount)
}

export type OnCommandHandler = (command: MetaCommand, payload: any, ctx: Context) => void | Promise<void>

const runHandlers: { [commandId: string]: OnCommandHandler[] } = {}
const globalRunHandlers: OnCommandHandler[] = []

function getOnRunHandlers (commandId: string) {
  let list = runHandlers[commandId]
  if (!list) {
    list = runHandlers[commandId] = []
  }
  return list
}

export function onCommand (id: string, handler: OnCommandHandler) {
  getOnRunHandlers(id).push(handler)
}

export function onAnyCommand (handler: OnCommandHandler) {
  globalRunHandlers.push(handler)
}

export function runCommand (id: string, payload: any, ctx: Context) {
  const command = commands.find(c => c.id === id)
  if (!command) {
    consola.warn(`Command ${id} not found`)
    return null
  }
  if (command.handler) {
    command.handler(command, payload, ctx)
  }
  getOnRunHandlers(command.id).forEach(h => h(command, payload, ctx))
  globalRunHandlers.forEach(h => h(command, payload, ctx))
  ctx.pubsub.publish('commandRan', {
    commandRan: {
      command,
      payload,
    },
    clientId: ctx.getClientId(),
  })
  return command
}

export const resolvers: Resolvers = {
  Command: {
    keybinding: command => keybindings.find(k => k.id === command.id),
  },

  Query: {
    searchCommands: (root, { text }) => searchCommands(text),

    command: (root, { id }) => commands.find(c => c.id === id),
  },

  Mutation: {
    runCommand: (root, { input }, ctx) => runCommand(input.id, input.payload, ctx),
  },

  Subscription: {
    commandRan: {
      subscribe: withFilter(
        (root, args, ctx) => ctx.pubsub.asyncIterator(['commandRan']),
        (payload, variables, context: Context) => {
          return !payload.clientId || payload.clientId === context.getClientId()
        },
      ),
    },
  },
}

// Help commands
for (const word in typeWords) {
  if (word === '?') continue
  addCommand({
    id: word,
    type: CommandType.Help,
    label: word,
    description: `guijs.find.help.${typeWords[word]}`,
  })
}

// Internal commands
addCommand({
  id: 'find',
  type: CommandType.Action,
  label: 'Find',
  hidden: true,
})

addKeybinding({
  id: 'find',
  sequences: ['mod+p', 'mod+k'],
  scope: 'root',
  global: true,
})

addCommand({
  id: 'command',
  type: CommandType.Action,
  label: 'Command',
  hidden: true,
})

addKeybinding({
  id: 'command',
  sequences: ['mod+shift+k', 'mod+shift+p'],
  scope: 'root',
  global: true,
})

onAnyCommand(async (cmd, payload, ctx) => {
  // @TODO persist lastUsed
  updateCommand(cmd.id, {
    lastUsed: new Date(),
  })
})
