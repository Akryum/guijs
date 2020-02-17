import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import LRU from 'lru-cache'
import ms from 'ms'
import { resolveModule } from '@nodepack/module'
import fs from 'fs-extra'
import consola from 'consola'
import { getProjectWorkspace } from '../project/workspace'
import Context from '@/generated/context'
import { MetaPackageMetadata } from './meta-types'

export const typeDefs = gql`
extend type ProjectPackage {
  currentVersion: String
}

extend type PackageMetadata {
  latestVersion: String
  versionTags: [PackageVersionTag!]!
  versions: [String!]!
}

type PackageVersionTag {
  tag: String!
  version: String!
}

extend type Subscription {
  packageMetadataUpdated: PackageMetadata
}
`

export interface PackageVersionData {
  latest: string
  tags: { [key: string]: string }
  versions: string[]
}

const packageVersionCache = new LRU<string, PackageVersionData>({
  max: 1000,
  maxAge: ms('2h'),
})

async function updateLatestVersion (metadata: MetaPackageMetadata, ctx: Context) {
  try {
    const data = await ctx.npm(`/${encodeURIComponent(metadata.id)}`)

    let latest: string
    if (data['dist-tags']) {
      latest = data['dist-tags'].latest
    }

    const versionData: PackageVersionData = {
      latest,
      tags: data['dist-tags'] || {},
      versions: Object.keys(data.versions),
    }

    packageVersionCache.set(metadata.id, versionData)

    ctx.pubsub.publish('packageMetadataUpdated', {
      packageMetadataUpdated: metadata,
    })
  } catch (e) {
    consola.warn(e.message)
  }
}

function getVersionData (metadata: MetaPackageMetadata, ctx: Context) {
  const versionData = packageVersionCache.get(metadata.id)
  if (!versionData) {
    // Update version in the background
    updateLatestVersion(metadata, ctx)
  }
  return versionData
}

export const resolvers: Resolvers = {
  ProjectPackage: {
    currentVersion: async (pkg, args, ctx) => {
      const project = await ctx.getProject()
      const workspace = await getProjectWorkspace(project, pkg.workspaceId, ctx)
      const pkgFile = resolveModule(`${pkg.id}/package.json`, workspace.absolutePath)
      const pkgData = await fs.readJson(pkgFile)
      return pkgData.version
    },
  },

  PackageMetadata: {
    latestVersion: (metadata, args, ctx) => {
      const version = getVersionData(metadata, ctx)
      return version ? version.latest : null
    },

    versionTags: (metadata, args, ctx) => {
      const version = getVersionData(metadata, ctx)
      if (version) {
        return Object.keys(version.tags).map(key => ({
          tag: key,
          version: version.tags[key],
        }))
      }
      return []
    },

    versions: (metadata, args, ctx) => {
      const version = getVersionData(metadata, ctx)
      if (version) {
        return version.versions
      }
      return []
    },
  },

  Subscription: {
    packageMetadataUpdated: {
      subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator(['packageMetadataUpdated']),
    },
  },
}
