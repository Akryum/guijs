import gql from 'graphql-tag'
import { Resolvers, ProjectPackageType, CommandType } from '@/generated/schema'
import fs from 'fs-extra'
import path from 'path'
import { MetaProjectPackage, MetaPackageMetadata, FaunaPackage } from './meta-types'
import { query as q } from 'faunadb'
import ms from 'ms'
import shortid from 'shortid'
import consola from 'consola'
import { getProjectTypes } from '../project-type'
import { MetaDocument } from '../db/meta-types'
import { removeCommands, commands, addCommand, runCommand } from '../command'
import { MetaProjectWorkspace } from '../project/meta-types'
import Context from '@/generated/context'
import { onProjectOpen } from '../project/open'
import { detectWorkspaces } from '../project/workspace'
import { onProjectClose } from '../project/close'
import { addKeybinding } from '../keybinding'
import LRU from 'lru-cache'

const PACKAGE_CACHE_VERSION = '0.0.1'

export const typeDefs = gql`
type ProjectPackage {
  id: ID!
  type: ProjectPackageType!
  versionSelector: String!
  metadata: PackageMetadata!
  isWorkspace: Boolean
}

type PackageMetadata {
  id: ID!
  awesomejsId: ID
  projectTypes: [ProjectType!]!
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

extend type Query {
  packageMetadata (id: ID!): PackageMetadata
}
`

const SELECTION = {
  id: q.Select(['ref', 'id'], q.Var('item')),
  name: q.Select(['data', 'name'], q.Var('item')),
  projectTypes: q.Select(['data', 'projectTypes'], q.Var('item')),
  tags: q.Select(['data', 'info', 'tags'], q.Var('item')),
  description: q.Select(['data', 'metadata', 'npm', 'data', 'description'], q.Var('item')),
  avatar: q.Select(['data', 'metadata', 'github', 'data', 'owner', 'avatar'], q.Var('item')),
}

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
        workspaceId: workspace.id,
      })
    }
  }

  if (pkg.devDependencies) {
    for (const id in pkg.devDependencies) {
      list.push({
        id,
        type: ProjectPackageType.Dev,
        versionSelector: pkg.devDependencies[id],
        workspaceId: workspace.id,
      })
    }
  }

  // Get cached data

  const missingMetadata: MetaProjectPackage[] = []

  for (const pkg of list) {
    if (project.workspaces) {
      pkg.isWorkspace = project.workspaces.some(w => w.name === pkg.id)
    }

    const { metadata, expired } = await getCachedMetadata(pkg.id, ctx)

    if (!metadata || expired) {
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
    try {
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
        q.Lambda(['item'], q.If(q.Not(q.IsNull(q.Var('item'))), SELECTION, null)),
      ))

      const newMetadata: MetaPackageMetadata[] = []

      // Create metadata
      for (let i = 0; i < faunaData.length; i++) {
        const raw = faunaData[i]
        if (raw) {
          const metadata: MetaPackageMetadata = {
            id: raw.name,
            awesomejsId: raw.id,
            cacheVersion: PACKAGE_CACHE_VERSION,
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
    } catch (e) {
      consola.warn(`Couldn't fetch package metadata`, e.message)
    }
  }

  return list as MetaProjectPackage[]
}

async function getCachedMetadata (id: string, ctx: Context) {
  let expired = false
  const metadata: MetaPackageMetadata & MetaDocument = await ctx.db.packages.findOne({ id })

  if (metadata && (
    metadata.cacheVersion !== PACKAGE_CACHE_VERSION ||
    Date.now() - metadata.createdAt.getTime() > ms('7 days'))) {
    // @TODO queue cache refresh
    expired = true
  }

  return {
    metadata,
    expired,
  }
}

async function fetchPackageMetadata (id: string, ctx: Context) {
  const faunaData = await ctx.fauna.query<{ data: FaunaPackage[] }>(q.Map(
    q.Paginate(q.Match(q.Index('packages_by_name'), id)),
    q.Lambda(['ref'], q.If(q.Exists(q.Var('ref')), q.Let({ item: q.Get(q.Var('ref')) }, SELECTION), null)),
  ))
  if (faunaData.data.length) {
    const raw = faunaData.data[0]
    const metadata: MetaPackageMetadata = {
      id: raw.name,
      awesomejsId: raw.id,
      cacheVersion: PACKAGE_CACHE_VERSION,
      projectTypeIds: raw.projectTypes.map(ref => ref.id),
      official: raw.tags.includes('official'),
      description: raw.description,
      defaultLogo: raw.avatar,
    }
    await ctx.db.packages.update({
      id: metadata.id,
    }, metadata, {
      upsert: true,
    })
    return metadata
  }
}

const fallbackMetadataCache = new LRU<string, MetaPackageMetadata>({
  max: 1000,
  maxAge: ms('1d'),
})

async function fetchFallbackMetadata (id: string, ctx: Context): Promise<MetaPackageMetadata> {
  const data = await ctx.npm(`/${encodeURIComponent(id)}`)
  const metadata = {
    id,
    projectTypeIds: [],
    description: data.description,
  }
  fallbackMetadataCache.set(id, metadata)
  ctx.pubsub.publish('packageMetadataUpdated', {
    packageMetadataUpdated: metadata,
  })
  return metadata
}

async function getFallbackMetadata (id: string, wait: boolean, ctx: Context): Promise<MetaPackageMetadata> {
  try {
    const cached = fallbackMetadataCache.get(id)
    if (cached) {
      return cached
    }

    const p = fetchFallbackMetadata(id, ctx)
    if (wait) {
      const result = await p
      return result
    }
  } catch (e) {
    consola.warn(e.message)
  }
  return {
    id,
    projectTypeIds: [],
    description: '',
  }
}

export const resolvers: Resolvers = {
  PackageMetadata: {
    projectTypes: metadata => {
      const projectTypes = getProjectTypes()
      return metadata.projectTypeIds.map(id => projectTypes.find(pt => pt.id === id))
    },
  },

  ProjectPackage: {
    metadata: async (pkg, args, ctx) => {
      if (pkg.metadata) return pkg.metadata

      const { metadata } = await getCachedMetadata(pkg.id, ctx)
      if (metadata) {
        return metadata
      }

      return getFallbackMetadata(pkg.id, false, ctx)
    },
  },

  ProjectWorkspace: {
    packages: async (workspace, args, ctx) => getWorkspacePackages(workspace, ctx),
  },

  Query: {
    packageMetadata: async (root, { id }, ctx) => {
      const { metadata, expired } = await getCachedMetadata(id, ctx)

      if (!metadata || expired) {
        const newMetadata = await fetchPackageMetadata(id, ctx)
        if (newMetadata) {
          return newMetadata
        }
      }

      if (metadata) {
        return metadata
      }

      return getFallbackMetadata(id, true, ctx)
    },
  },
}

addCommand({
  id: 'show-packages',
  type: CommandType.Action,
  label: 'Show packages',
  description: 'guijs.package.show-packages',
})

addKeybinding({
  id: 'show-packages',
  scope: 'root',
  sequences: ['k'],
})

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
