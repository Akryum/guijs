import { addCommand } from '../command'
import { CommandType, Resolvers } from '@/generated/schema'
import gql from 'graphql-tag'

export const typeDefs = gql`
extend type Mutation {
  createProject (input: CreateProjectInput!): Task
}

input CreateProjectInput {
  monorepo: Boolean!
  name: String!
  baseFolder: String!
  simpleProject: CreateSimpleProjectInput
}

input CreateSimpleProjectInput {
  projectGeneratorId: ID!
}
`

export const resolvers: Resolvers = {

}

addCommand({
  id: 'create-project',
  type: CommandType.Action,
  label: 'Create a project',
  description: 'guijs.create-project.create-a-project',
  icon: 'add',
})
