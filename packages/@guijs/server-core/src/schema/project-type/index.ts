import gql from 'graphql-tag'
import { ProjectType, Resolvers } from '@/generated/schema'
import { hook } from '@nodepack/app-context'
import Context from '@/generated/context'
import { query as q } from 'faunadb'
import { parseJSON } from 'faunadb/src/_json'
import path from 'path'
import fs from 'fs-extra'
import { rcFolder } from '@/util/rc-folder'
import consola from 'consola'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  slug: String!
  logo: String!
}

extend type Query {
  projectTypes: [ProjectType!]!
  projectType (id: ID!): ProjectType
}
`

const backupFile = path.resolve(rcFolder, 'db/projectTypes.json')
fs.ensureDirSync(path.dirname(backupFile))

let projectTypes: ProjectType[]

export function getProjectTypes () {
  return projectTypes
}

export const resolvers: Resolvers = {
  ProjectType: {
    logo: (projectType) => `https://awesomejs.dev${projectType.logo}`,
  },

  Query: {
    projectTypes: () => projectTypes,

    projectType: (root, { id }) => projectTypes.find(pt => pt.id === id),
  },
}

hook('apolloSchema', async (ctx: Context) => {
  if (!projectTypes) {
    try {
      const { data } = await ctx.fauna.query(q.Map(
        q.Paginate(q.Match(q.Index('projecttypes_sort_by_name_asc')), { size: 10000 }),
        q.Lambda(['name', 'ref'], q.Get(q.Var('ref'))),
      ))
      projectTypes = data.map(doc => ({
        id: doc.ref.id,
        ref: doc.ref,
        ...doc.data,
      }))
      await fs.writeJson(backupFile, projectTypes)
    } catch (e) {
      if (!fs.existsSync(backupFile)) {
        throw e
      }
      consola.warn(e.message)
      projectTypes = parseJSON(await fs.readFile(backupFile, { encoding: 'utf8' }))
    }
  }
})
