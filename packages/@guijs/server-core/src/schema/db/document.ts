import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'

export const typeDefs = gql`
interface Document {
  id: ID!
}
`

export const resolvers: Resolvers = {
  Document: {
    id: doc => doc._id,
  },
}
