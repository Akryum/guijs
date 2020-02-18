import { addCommand } from '../command'
import { CommandType, Resolvers, ProjectPackageType } from '@/generated/schema'
import gql from 'graphql-tag'
import { installPackage, getPkgCommand } from '@nodepack/utils'
import { withFilter } from 'apollo-server-express'
import { executeTask } from '../task'
import { MetaProjectPackage } from './meta-types'
import { getProjectWorkspace } from '../project/workspace'
import Context from '@/generated/context'

export const typeDefs = gql`
extend type Mutation {
  installPackage (input: InstallPackageInput!): Task
}

input InstallPackageInput {
  packageName: String!
  workspaceId: String!
  dev: Boolean!
  versionSelector: String
}

extend type Subscription {
  projectPackageAdded (projectId: ID, workspaceId: ID): ProjectPackage!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    installPackage: async (root, { input }, ctx) => executeTask({
      type: 'install-package',
      payload: input,
    }, async () => {
      const project = await ctx.getProject()
      const workspace = await getProjectWorkspace(project, input.workspaceId, ctx)

      const cmd = getPkgCommand(workspace.absolutePath)
      await installPackage(workspace.absolutePath, cmd, null, `${input.packageName}${input.versionSelector ? `@${input.versionSelector}` : ''}`, input.dev)

      const pkg: MetaProjectPackage = {
        id: input.packageName,
        type: input.dev ? ProjectPackageType.Dev : ProjectPackageType.Main,
        versionSelector: input.versionSelector,
        workspaceId: input.workspaceId,
      }

      ctx.pubsub.publish('projectPackageAdded', {
        projectPackageAdded: pkg,
      })
    }, ctx),
  },

  Subscription: {
    projectPackageAdded: {
      subscribe: withFilter(
        (root, args, ctx) => ctx.pubsub.asyncIterator(['projectPackageAdded']),
        (payload, variables, context: Context) => {
          return (!variables.projectId || context.getProjectId() === variables.projectId) &&
            (!variables.workspaceId || payload.projectPackageAdded.workspaceId === variables.workspaceId)
        },
      ),
    },
  },
}

addCommand({
  id: 'install-package-popup',
  type: CommandType.Action,
  label: 'Open install package popup',
  hidden: true,
})

addCommand({
  id: 'install-package',
  type: CommandType.Action,
  label: 'Install package',
  hidden: true,
})
