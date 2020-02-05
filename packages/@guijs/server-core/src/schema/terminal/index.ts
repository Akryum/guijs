import gql from 'graphql-tag'
import { Resolvers, CommandType } from '@/generated/schema'
import { terminals, createTerminal, removeTerminal } from './server'
import { addCommand } from '../command'
import { addKeybinding } from '../keybinding'

export const typeDefs = gql`
type Terminal {
  id: ID!
  name: String!
  title: String!
  cwd: String!
}

type Query {
  terminal (id: ID!): Terminal
  terminals: [Terminal!]!
}

type Mutation {
  createTerminal (input: CreateTerminalInput!): Terminal
  changeTerminalTitle (input: ChangeTerminalTitleInput!): Terminal
  removeTerminal (id: ID!): Terminal
}

input CreateTerminalInput {
  name: String!
  title: String!
  cwd: String
  hidden: Boolean!
}

input ChangeTerminalTitleInput {
  id: ID!
  title: String!
}
`

export const resolvers: Resolvers = {
  Query: {
    terminal: (root, { id }) => terminals.find(t => t.id === id),
    terminals: () => terminals.filter(t => !t.hidden),
  },

  Mutation: {
    createTerminal: async (root, { input }) => {
      const terminal = await createTerminal(input)
      terminal.runShell()
      return terminal
    },
    changeTerminalTitle: (root, { input }) => {
      const terminal = terminals.find(t => t.id === input.id)
      if (terminal) {
        terminal.title = input.title
        return terminal
      }
    },
    removeTerminal: (root, { id }) => removeTerminal(id),
  },
}

addCommand({
  id: 'toggle-terminals',
  type: CommandType.Action,
  label: 'Toggle terminals',
  icon: 'laptop',
  description: 'guijs.status-bar.toggle-terminals',
})

addKeybinding({
  id: 'toggle-terminals',
  description: 'guijs.status-bar.toggle-terminals',
  sequences: ['mod+shift+;', 'mod+alt+k t'],
  scope: 'root',
  global: true,
})

addCommand({
  id: 'new-terminal',
  type: CommandType.Action,
  label: 'New terminal',
  icon: 'add',
  description: 'guijs.terminals.new-terminal',
})

addKeybinding({
  id: 'new-terminal',
  description: 'guijs.terminals.new-terminal',
  sequences: ['mod+shift+c'],
  scope: 'root',
  global: true,
})

addKeybinding({
  id: 'close-terminal',
  description: 'guijs.terminals.close-terminal',
  sequences: ['mod+shift+w', 'mod+shift+x'],
  scope: 'terminals',
  global: true,
})
