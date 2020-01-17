import gql from 'graphql-tag'
import getWorkspaces from '@guijs/get-workspaces'
import path from 'path'
import { MetaProjectWorkspace } from './meta-types'
import { Resolvers } from '@/generated/schema'
import { getProjectTypes } from '../project-type'

export const typeDefs = gql`
type ProjectWorkspace {
  id: ID!
  name: String!
  absolutePath: String!
  relativePath: String!
  type: ProjectType!
}

extend type Project {
  workspaces: [ProjectWorkspace!]!
}
`

async function detectWorkspaces (cwd: string): Promise<MetaProjectWorkspace[]> {
  const workspaces = await getWorkspaces({
    cwd,
  })

  return workspaces.map(w => ({
    id: w.dir,
    name: w.name,
    absolutePath: w.dir,
    relativePath: path.relative(cwd, w.dir),
    typeId: '244960132405920258',
  }))
}

export const resolvers: Resolvers = {
  ProjectWorkspace: {
    type: (workspace) => getProjectTypes().find(pt => pt.id === workspace.typeId),
  },

  Project: {
    workspaces: (project) => detectWorkspaces(project.path),
  },
}
