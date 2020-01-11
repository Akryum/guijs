import gql from 'graphql-tag'
import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'

export const typeDefs = gql`
type Project {
  id: ID!
  name: String!
  bookmarked: Boolean!
}
`

addCommand({
  id: 'find-projects',
  type: CommandType.Action,
  label: 'Recent projects',
  description: 'guijs.home.recent-projects',
})
