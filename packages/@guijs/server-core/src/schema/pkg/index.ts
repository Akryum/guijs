import gql from 'graphql-tag'
import { Resolvers, ProjectPackageType } from '@/generated/schema'
import fs from 'fs-extra'
import path from 'path'
import { MetaProjectPackage, MetaPackage } from './meta-types'
import { query as q, values } from 'faunadb'
import { getProjectTypes } from '../project-type'

export const typeDefs = gql`
type ProjectPackage {
  id: ID!
  metadataId: ID
  type: ProjectPackageType!
  projectTypes: [ProjectType!]!
  versionSelector: String!
  isWorkspace: Boolean
}

enum ProjectPackageType {
  main
  dev
}

extend type ProjectWorkspace {
  packages: [ProjectPackage!]!
}
`

export const resolvers: Resolvers = {
  ProjectPackage: {
    metadataId: pkg => pkg.metadata ? pkg.metadata.id : null,

    projectTypes: pkg => {
      if (pkg.metadata) {
        const projectTypes = getProjectTypes()
        return pkg.metadata.projectTypeIds.map(id => projectTypes.find(pt => pt.id === id))
      }
      return []
    },
  },

  ProjectWorkspace: {
    packages: async (workspace, args, ctx) => {
      const project = await ctx.getProject()

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

        const metadata: MetaPackage = await ctx.db.packages.findOne({ name: pkg.id })

        if (!metadata) {
          missingMetadata.push(pkg)
        }

        pkg.metadata = metadata
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
        const data = await ctx.fauna.query<Array<{ id: string, name: string, projectTypes: values.Ref[] }>>(q.Map(
          queries,
          q.Lambda(['item'], q.If(q.Not(q.IsNull(q.Var('item'))), {
            id: q.Select(['ref', 'id'], q.Var('item')),
            name: q.Select(['data', 'name'], q.Var('item')),
            projectTypes: q.Select(['data', 'projectTypes'], q.Var('item')),
          }, null)),
        ))

        const newMetadata: MetaPackage[] = []

        // Process awesomejs.dev data
        for (let i = 0; i < data.length; i++) {
          const raw = data[i]
          if (raw) {
            const metadata = {
              id: raw.id,
              name: raw.name,
              projectTypeIds: raw.projectTypes.map(ref => ref.id),
            }
            newMetadata.push(metadata)
            missingMetadata[i].metadata = metadata
          }
        }

        // Save to cache
        await ctx.db.packages.insert(newMetadata)
      }

      return list as MetaProjectPackage[]
    },
  },
}
