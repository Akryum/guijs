import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
interface Document {
  id: ID!
}
`

export const resolvers: Resolvers = {
  Document: {
    __resolveType () {
      return null
    },
    id: doc => doc._id,
  },
}
