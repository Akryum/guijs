import gql from 'graphql-tag'
import { GraphQLScalarType, Kind } from 'graphql'

export const typeDefs = gql`
scalar Date
`

export const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date timestamp. It\'s serialized as a time number in ms, for example `1550923964562`.',
    parseValue (value) {
      return new Date(value)
    },
    serialize (value: Date) {
      return new Date(value).getTime()
    },
    parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null
    },
  }),
}
