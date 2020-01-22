import gql from 'graphql-tag'
import { Resolvers, ProjectPackageType, CommandType } from '@/generated/schema'
import fs from 'fs-extra'
import path from 'path'
import { MetaProjectPackage, MetaPackage, FaunaPackage } from './meta-types'
import { query as q } from 'faunadb'
import ms from 'ms'
import shortid from 'shortid'
import { getProjectTypes } from '../project-type'
import { MetaDocument } from '../db/meta-types'
import { removeCommands, commands, addCommand, runCommand } from '../command'
import { MetaProjectWorkspace } from '../project/meta-types'
import Context from '@/generated/context'
import { onProjectOpen } from '../project/open'
import { detectWorkspaces } from '../project/workspace'
import { onProjectClose } from '../project/close'

const PACKAGE_CACHE_VERSION = '0.0.1'

export const typeDefs = gql`
type ProjectPackage {
  id: ID!
  metadataId: ID
  type: ProjectPackageType!
  projectTypes: [ProjectType!]!
  versionSelector: String!
  isWorkspace: Boolean
  official: Boolean
  description: String
  defaultLogo: String
}

enum ProjectPackageType {
  main
  dev
}

extend type ProjectWorkspace {
  packages: [ProjectPackage!]!
}
`

export async function getWorkspacePackages (
  workspace: MetaProjectWorkspace,
  ctx: Context,
) {
  const project = await ctx.getProject()

  // Clear package commands
  removeCommands(commands.filter(cmd => cmd.projectId === project._id &&
    cmd.type === CommandType.Package &&
    cmd.related.workspaceId === workspace.id))

  const list: MetaProjectPackage[] = []

  // Read package.json

  const pkg = await fs.readJson(path.resolve(workspace.absolutePath, 'package.json'))
  if (pkg.dependencies) {
    for (const id in pkg.dependencies) {
      list.push({
        id,
        type: ProjectPackageType.Main,
        versionSelector: pkg.dependencies[id],
      })
    }
  }

  if (pkg.devDependencies) {
    for (const id in pkg.devDependencies) {
      list.push({
        id,
        type: ProjectPackageType.Dev,
        versionSelector: pkg.devDependencies[id],
      })
    }
  }

  // Get cached data

  const missingMetadata: MetaProjectPackage[] = []

  for (const pkg of list) {
    if (project.workspaces) {
      pkg.isWorkspace = project.workspaces.some(w => w.name === pkg.id)
    }

    const metadata: MetaPackage & MetaDocument = await ctx.db.packages.findOne({ name: pkg.id })

    if (!metadata ||
        metadata.version !== PACKAGE_CACHE_VERSION ||
        Date.now() - metadata.createdAt.getTime() > ms('7 days')) {
      missingMetadata.push(pkg)
    }

    pkg.metadata = metadata

    // Commands
    addCommand({
      id: `package-${shortid()}`,
      type: CommandType.Package,
      label: pkg.id,
      projectId: project._id,
      related: {
        workspaceId: workspace.id,
      },
      handler: (cmd, payload, ctx) => {
        let projectTypeId
        const metadata = pkg.metadata
        if (metadata && metadata.projectTypeIds.length) {
          projectTypeId = metadata.projectTypeIds[0]
        } else {
          projectTypeId = '__unknown'
        }

        runCommand('show-package', {
          projectId: project._id,
          workspaceId: workspace.id,
          projectTypeId,
          packageId: pkg.id,
        }, ctx)
      },
    })
  }

  // Get data from awesomejs.dev

  if (missingMetadata.length) {
    const queries = []
    // Get packages by name
    for (const pkg of missingMetadata) {
      queries.push(q.Let({
        ref: q.Match(q.Index('packages_by_name'), pkg.id),
      },
      q.If(q.Exists(q.Var('ref')),
        q.Get(q.Var('ref')),
        null,
      )))
    }

    // It should return null for packages not found
    const faunaData = await ctx.fauna.query<FaunaPackage[]>(q.Map(
      queries,
      q.Lambda(['item'], q.If(q.Not(q.IsNull(q.Var('item'))), {
        id: q.Select(['ref', 'id'], q.Var('item')),
        name: q.Select(['data', 'name'], q.Var('item')),
        projectTypes: q.Select(['data', 'projectTypes'], q.Var('item')),
        tags: q.Select(['data', 'info', 'tags'], q.Var('item')),
        description: q.Select(['data', 'metadata', 'npm', 'data', 'description'], q.Var('item')),
        avatar: q.Select(['data', 'metadata', 'github', 'data', 'owner', 'avatar'], q.Var('item')),
      }, null)),
    ))

    const newMetadata: MetaPackage[] = []

    // Create metadata
    for (let i = 0; i < faunaData.length; i++) {
      const raw = faunaData[i]
      if (raw) {
        const metadata: MetaPackage = {
          id: raw.id,
          name: raw.name,
          version: PACKAGE_CACHE_VERSION,
          projectTypeIds: raw.projectTypes.map(ref => ref.id),
          official: raw.tags.includes('official'),
          description: raw.description,
          defaultLogo: raw.avatar,
        }
        newMetadata.push(metadata)
        missingMetadata[i].metadata = metadata
      }
    }

    // Save to cache
    await ctx.db.packages.insert(newMetadata)
  }

  return list as MetaProjectPackage[]
}

export const resolvers: Resolvers = {
  ProjectPackage: {
    metadataId: pkg => pkg.metadata ? pkg.metadata.id : null,
    official: pkg => pkg.metadata ? pkg.metadata.official : null,
    description: pkg => pkg.metadata ? pkg.metadata.description : null,
    defaultLogo: pkg => pkg.metadata ? pkg.metadata.defaultLogo : null,

    projectTypes: pkg => {
      if (pkg.metadata) {
        const projectTypes = getProjectTypes()
        return pkg.metadata.projectTypeIds.map(id => projectTypes.find(pt => pt.id === id))
      }
      return []
    },
  },

  ProjectWorkspace: {
    packages: async (workspace, args, ctx) => getWorkspacePackages(workspace, ctx),
  },
}

addCommand({
  id: 'show-package',
  type: CommandType.Action,
  label: 'Show package',
  hidden: true,
})

onProjectOpen(async (project, ctx) => {
  // Scan workspaces to index packages
  const workspaces = await detectWorkspaces(project, ctx)
  for (const workspace of workspaces) {
    await getWorkspacePackages(workspace, ctx)
  }
})

onProjectClose(async (project) => {
  // Clear package commands
  removeCommands(commands.filter(cmd => cmd.projectId === project._id &&
    cmd.type === CommandType.Package))
})
