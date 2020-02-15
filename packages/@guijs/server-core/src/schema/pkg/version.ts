import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import LRU from 'lru-cache'
import ms from 'ms'
import { resolveModule } from '@nodepack/module'
import fs from 'fs-extra'
import { getProjectWorkspace } from '../project/workspace'
import Context from '@/generated/context'
import { MetaProjectPackage } from './meta-types'

export const typeDefs = gql`
extend type ProjectPackage {
  currentVersion: String
  latestVersion: String
}

extend type Subscription {
  projectPackageUpdated: ProjectPackage
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

async function updateLatestVersion (pkg: MetaProjectPackage, ctx: Context) {
  const data = await ctx.npm(`/${encodeURIComponent(pkg.id)}`)

  let latest: string
  if (data['dist-tags']) {
    latest = data['dist-tags'].latest
  }

  const versionData: PackageVersionData = {
    latest,
    tags: data['dist-tags'],
    versions: Object.keys(data.versions),
  }

  packageVersionCache.set(pkg.id, versionData)

  ctx.pubsub.publish('projectPackageUpdated', {
    projectPackageUpdated: pkg,
  })

  return data
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

    latestVersion: (pkg, args, ctx) => {
      const version = packageVersionCache.get(pkg.id)
      if (!version) {
        // Update version in the background
        updateLatestVersion(pkg, ctx)
        return null
      }
      return version.latest
    },
  },

  Subscription: {
    projectPackageUpdated: {
      subscribe: (root, args, ctx) => ctx.pubsub.asyncIterator(['projectPackageUpdated']),
    },
  },
}
