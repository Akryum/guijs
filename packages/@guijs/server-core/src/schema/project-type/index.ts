import gql from 'graphql-tag'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  logo: String!
}
`
