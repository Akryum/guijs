import gql from 'graphql-tag'
import { ProjectType, Resolvers } from '@/generated/schema'
import { hook } from '@nodepack/app-context'
import Context from '@/generated/context'
import { query as q } from 'faunadb'

export const typeDefs = gql`
type ProjectType {
  id: ID!
  name: String!
  logo: String!
}
`

let projectTypes: ProjectType[]

export function getProjectTypes () {
  return projectTypes
}

export const resolvers: Resolvers = {
  ProjectType: {
    logo: (projectType) => `https://awesomejs.dev${projectType.logo}`,
  },
}

hook('apolloSchema', async (ctx: Context) => {
  if (!projectTypes) {
    const { data } = await ctx.fauna.query(q.Map(
      q.Paginate(q.Match(q.Index('all_projecttypes')), { size: 10000 }),
      q.Lambda(['ref'], q.Get(q.Var('ref'))),
    ))
    projectTypes = data.map(doc => ({
      id: doc.ref.id,
      red: doc.red,
      ...doc.data,
    }))
  }
})
