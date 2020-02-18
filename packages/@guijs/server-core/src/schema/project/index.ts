import gql from 'graphql-tag'
import { addCommand, getRecentCommands } from '../command'
import { CommandType, Resolvers } from '@/generated/schema'
import { addKeybinding } from '../keybinding'
import { MetaProject } from './meta-types'
import Context from '@/generated/context'
import { hook } from '@nodepack/app-context'

export const typeDefs = gql`
type Project implements Document {
  id: ID!
  name: String!
  path: String!
  bookmarked: Boolean!
  lastOpen: Date
}

extend type Query {
  projects: [Project!]!
  project (id: ID!): Project
  recentProjects: [Project!]!
  bookmarkedProjects: [Project!]!
  recentProjectCommands: [Command!]!
}
`

export const resolvers: Resolvers = {
  Query: {
    projects: async (root, args, ctx) => ctx.db.projects.find<MetaProject>({}),

    project: async (root, { id }, ctx) => ctx.db.projects.findOne<MetaProject>({ _id: id }),

    recentProjects: async (root, args, ctx) => ctx.db.projects.cfind<MetaProject>({ bookmarked: false }).sort({ lastOpen: -1 }).limit(3).exec(),

    bookmarkedProjects: async (root, args, ctx) => ctx.db.projects.cfind<MetaProject>({ bookmarked: true }).sort({ lastOpen: -1 }).limit(7).exec(),

    recentProjectCommands: () => getRecentCommands(CommandType.Project, 5),
  },
}

export async function addProject (project: MetaProject, ctx: Context) {
  const [doc] = await ctx.db.projects.insert([
    project,
  ])

  addProjectCommand(doc)

  return doc
}

hook('apolloSchema', async (ctx: Context) => {
  // Add project commands
  const projects = await ctx.db.projects.find({})
  for (const project of projects) {
    addProjectCommand(project)
  }
})

function addProjectCommand (project: MetaProject) {
  addCommand({
    id: `project.${project._id}`,
    type: CommandType.Project,
    label: project.name,
    description: project.path,
    icon: 'work',
    lastUsed: project.lastOpen,
    related: project,
  })
}

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
  icon: 'unarchive',
})
