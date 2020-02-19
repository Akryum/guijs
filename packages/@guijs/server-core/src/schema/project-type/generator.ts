import { Resolvers } from '@/generated/schema'
import gql from 'graphql-tag'
import { MetaProjectGenerator } from './meta-types'
import { hook } from '@nodepack/app-context'
import Context from '@/generated/context'
import { query as q } from 'faunadb'
import { getProjectTypes } from '../project-type'
import { parseJSON } from 'faunadb/src/_json'
import path from 'path'
import fs from 'fs-extra'
import { rcFolder } from '@/util/rc-folder'
import consola from 'consola'

export const typeDefs = gql`
type ProjectGenerator {
  id: ID!
  name: String!
  projectType: ProjectType!
  packageName: String!
}

extend type Query {
  projectGenerators: [ProjectGenerator!]!
}
`

const backupFile = path.resolve(rcFolder, 'db/projectGenerators.json')
fs.ensureDirSync(path.dirname(backupFile))

let projectGenerators: MetaProjectGenerator[]

export function getProjectGenerators () {
  return projectGenerators
}

export const resolvers: Resolvers = {
  ProjectGenerator: {
    projectType: generator => getProjectTypes().find(pt => pt.id === generator.projectType.id),
  },

  Query: {
    projectGenerators: () => projectGenerators,
  },
}

hook('apolloSchema', async (ctx: Context) => {
  if (!projectGenerators) {
    try {
      const { data } = await ctx.fauna.query(q.Map(
        q.Paginate(q.Match(q.Index('project_generators_sort_by_name')), { size: 10000 }),
        q.Lambda(['name', 'ref'], q.Get(q.Var('ref'))),
      ))
      projectGenerators = data.map(doc => ({
        id: doc.ref.id,
        ref: doc.ref,
        ...doc.data,
      }))
      await fs.writeJson(backupFile, projectGenerators)
    } catch (e) {
      if (!fs.existsSync(backupFile)) {
        throw e
      }
      consola.warn(e.message)
      projectGenerators = parseJSON(await fs.readFile(backupFile, { encoding: 'utf8' }))
    }
  }
})
