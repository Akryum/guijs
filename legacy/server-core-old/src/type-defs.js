const gql = require('graphql-tag')

const typeDefs = [gql`
scalar JSON

enum PackageManager {
  npm
  yarn
  pnpm
}

interface DescribedEntity {
  name: String
  description: String
  link: String
}

type Version {
  current: String
  latest: String
  wanted: String
  range: String
  localPath: String
}

type GitHubStats {
  stars: Int
}

type Progress {
  id: ID!
  status: String
  info: String
  error: String
  # Progress from 0 to 1 (-1 means disabled)
  progress: Float
  args: [String]
}

input OpenInEditorInput {
  file: String!
  line: Int
  column: Int
  gitPath: Boolean
}

type ClientAddon {
  id: ID!
  url: String!
}

type SharedData {
  id: ID!
  value: JSON
}

type Locale {
  lang: String!
  strings: JSON!
}

type Query {
  progress (id: ID!): Progress
  cwd: String!
  clientAddons: [ClientAddon]
  sharedData (id: ID!, projectId: ID!): SharedData
  locales: [Locale]
}

type Mutation {
  fileOpenInEditor (input: OpenInEditorInput!): Boolean
  sharedDataUpdate (id: ID!, projectId: ID!, value: JSON!): SharedData
  removeProgress (id: ID!): Boolean
}

type Subscription {
  progressChanged (id: ID!): Progress
  progressRemoved (id: ID!): ID
  cwdChanged: String!
  clientAddonAdded: ClientAddon
  sharedDataUpdated (id: ID!, projectId: ID!): SharedData
  localeAdded: Locale
  routeRequested: JSON!
}
`]

// Load types in './schema'
const schemaFiles = require.context('./schema', false, /\.js$/)
for (const key of schemaFiles.keys()) {
  const { types } = schemaFiles(key)
  types && typeDefs.push(types)
}

module.exports = typeDefs
