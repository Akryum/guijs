import gql from 'graphql-tag'
import { Resolvers, CommandType } from '@/generated/schema'
import { terminals, createTerminal, removeTerminal } from './server'
import { addCommand } from '../command'

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
    createTerminal: (root, { input }) => createTerminal(input),
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

addCommand({
  id: 'new-terminal',
  type: CommandType.Action,
  label: 'New terminal',
  icon: 'add',
  description: 'guijs.terminals.new-terminal',
  handler () {
    console.log('new terminal called')
  },
})
