const gql = require('graphql-tag')
// Connectors
const projects = require('../connectors/projects')
const plugins = require('../connectors/plugins')
const tasks = require('../connectors/tasks')
const prompts = require('../connectors/prompts')

exports.types = gql`
extend type Query {
  projects: [Project]
  project (id: ID!): Project
  projectCurrent: Project
  projectCreationWizard: ProjectCreationWizard
}

extend type Mutation {
  projectInitCreation (input: ProjectInitCreationInput): ProjectCreationWizard!
  projectCancelCreation: Boolean
  projectCreate: Project!
  projectImport (input: ProjectImportInput!): Project!
  projectOpen (id: ID!): Project!
  projectRemove (id: ID!): Boolean!
  projectCwdReset: String
  projectSetFavorite (id: ID!, favorite: Int!): Project!
  projectRename (id: ID!, name: String!): Project!
}

type Project {
  id: ID!
  name: String!
  type: ProjectType
  path: String!
  favorite: Int
  plugins: [Plugin]
  tasks: [Task]
  hasRunningTasks: Boolean!
  homepage: String
  openDate: JSON
}

input ProjectInitCreationInput {
  type: ID!
}

input ProjectImportInput {
  path: String!
  force: Boolean
}

type ProjectCreationWizard {
  type: ProjectType!
  steps: [ProjectCreationWizardStep!]!
}

type ProjectCreationWizardStep {
  id: ID!
  type: ProjectCreationWizardStepType!
  name: String
  enabled: Boolean!
  prompts: [Prompt!]
  icon: String
  description: String
}

enum ProjectCreationWizardStepType {
  general
  prompts
  select
  modal
}
`

exports.resolvers = {
  Project: {
    type: (project, args, context) => projects.getType(project, context),
    plugins: (project, args, context) => plugins.list(project.path, context),
    tasks: (project, args, context) => tasks.list({ file: project.path }, context),
    homepage: (project, args, context) => projects.getHomepage(project, context),
    hasRunningTasks: async (project, args, context) => projects.isOpen({ id: project.id }, context) &&
      (await tasks.list({ file: project.path }, context)).some(t => t.status === 'running'),
  },

  ProjectCreationWizardStep: {
    enabled: (step, args, context) => projects.isCreationStepEnabled(step.id, context),
    prompts: (step, args, context) => prompts.list().filter(p => p.tabId === step.id),
    icon: (step, args, context) => step.options ? step.options.icon : null,
    description: (step, args, context) => step.options ? step.options.description : null,
  },

  Query: {
    projects: (root, args, context) => projects.list(context),
    project: (root, { id }, context) => projects.findOne(id, context),
    projectCurrent: (root, args, context) => projects.getCurrent(context),
    projectCreationWizard: (root, args, context) => projects.getCreationWizard(context),
  },

  Mutation: {
    projectInitCreation: (root, { input }, context) => projects.initCreator(input, context),
    projectCancelCreation: (root, args, context) => projects.removeCreator(context),
    projectCreate: (root, args, context) => projects.create(context),
    projectImport: (root, { input }, context) => projects.importProject(input, context),
    projectOpen: (root, { id }, context) => projects.open(id, context),
    projectRemove: (root, { id }, context) => projects.remove(id, context),
    projectCwdReset: (root, args, context) => projects.resetCwd(context),
    projectSetFavorite: (root, args, context) => projects.setFavorite(args, context),
    projectRename: (root, args, context) => projects.rename(args, context),
  },
}
