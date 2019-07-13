import gql from 'graphql-tag'
import { getTypes } from '../connectors/project-types'

export const types = gql`
type ProjectType {
  id: ID!
  name: String!
  logo: String
}

extend type Query {
  projectTypes: [ProjectType!]!
}
`

export const resolvers = {
  Query: {
    projectTypes: (root, args, context) => getTypes(context),
  },
}
