import gql from 'graphql-tag'
import GraphQLJSON from 'graphql-type-json'

export const typeDefs = gql`
scalar JSON
`

export const resolvers = {
  JSON: GraphQLJSON,
}
