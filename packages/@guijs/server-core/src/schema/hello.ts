import gql from 'graphql-tag'
import { IResolvers } from 'graphql-tools'
import { ApolloContext } from '@nodepack/plugin-apollo'

export const typeDefs = gql`
type Query {
  hello: String!
}
`

export const resolvers: IResolvers = {
  Query: {
    hello: (root, args, ctx: ApolloContext, info) => `Hello world`,
  },
}
