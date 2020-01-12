import gql from 'graphql-tag'
import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'

export const typeDefs = gql`
type Project {
  id: ID!
  name: String!
  path: String!
  bookmarked: Boolean!
  lastOpen: Date
  workspaces: [Workspace!]!
}

type Workspace {
  id: ID!
  name: String!
  relativePath: String!
  type: ProjectType!
}
`

addCommand({
  id: 'find-projects',
  type: CommandType.Action,
  label: 'Recent projects',
  description: 'guijs.home.recent-projects',
})
