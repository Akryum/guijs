import gql from 'graphql-tag'
import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'
import { addKeybinding } from '../keybinding'

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

addKeybinding({
  id: 'find-projects',
  sequences: ['mod+r'],
  scope: 'root',
  global: true,
})

addCommand({
  id: 'import-project',
  type: CommandType.Action,
  label: 'Import a project',
  description: 'guijs.import-project.import-a-project',
})
