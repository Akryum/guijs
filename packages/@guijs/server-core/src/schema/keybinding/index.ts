import gql from 'graphql-tag'
import { Resolvers, Keybinding } from '@/generated/schema'

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
  keybinding (id: ID!): Keybinding
}
`

// @TODO dynamic keybindings reloading
export const keybindings: Keybinding[] = []

export function addKeybinding (keybinding: Keybinding) {
  keybindings.push(keybinding)
}

export const resolvers: Resolvers = {
  Query: {
    keybindings: () => keybindings,

    keybinding: (root, { id }) => keybindings.find(k => k.id === id),
  },
}
