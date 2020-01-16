import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { commands } from '.'

export const typeDefs = gql`
extend type Query {
  commandShortcuts: [Command!]!
}
`

export const resolvers: Resolvers = {
  Query: {
    commandShortcuts: () => shortcuts.map(id => commands.find(c => c.id === id)),
  },
}

const shortcuts: string[] = []

export function addCommandShortcut (id: string) {
  shortcuts.push(id)
}
