import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
type Keybinding {
  id: ID!
  description: String
  sequences: [String!]!
  scope: String!
  global: Boolean
}

extend type Query {
  keybindings: [Keybinding!]!
}
`

// @TODO dynamic keybindings

export const resolvers: Resolvers = {
  Query: {
    keybindings: () => [
      {
        id: 'toggle-terminals',
        description: 'guijs.status-bar.toggle-terminals',
        sequences: ['mod+shift+¥'],
        scope: 'root',
        global: true,
      },
      {
        id: 'new-terminal',
        description: 'guijs.terminals.new-terminal',
        sequences: ['mod+shift+c'],
        scope: 'root',
        global: true,
      },
      {
        id: 'close-terminal',
        description: 'guijs.terminals.close-terminal',
        sequences: ['mod+shift+w', 'mod+shift+x'],
        scope: 'terminals',
        global: true,
      },
    ],
  },
}
