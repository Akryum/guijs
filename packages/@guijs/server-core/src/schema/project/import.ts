import gql from 'graphql-tag'
import { Resolvers, ImportProjectInput } from '@/generated/schema'
import fs from 'fs-extra'
import path from 'path'
import Context from '@/generated/context'
import shortid from 'shortid'

export const typeDefs = gql`
extend type Mutation {
  checkImportProject (path: String!): CheckProjectPayload!
  importProject (input: ImportProjectInput!): Project!
}

type CheckProjectPayload {
  packageName: String!
}

input ImportProjectInput {
  path: String!
  name: String!
  bookmarked: Boolean
}
`

async function checkImportProject (dir: string) {
  if (!fs.existsSync(dir)) {
    throw new Error('guijs.import-project.error-path-does-not-exist')
  }

  const stats = await fs.stat(dir)
  if (!stats.isDirectory()) {
    throw new Error('guijs.import-project.error-not-directory')
  }

  const pkgFile = path.resolve(dir, 'package.json')
  if (!fs.existsSync(pkgFile)) {
    throw new Error('guijs.import-project.error-no-package-json')
  }

  const pkg = await fs.readJson(pkgFile)
  if (!pkg.name) {
    throw new Error('guijs.import-project.error-no-package-name')
  }

  return {
    packageName: pkg.name,
  }
}

async function importProject (
  input: ImportProjectInput,
  ctx: Context,
) {
  const project = {
    id: shortid(),
    name: input.name,
    path: input.path,
    bookmarked: input.bookmarked,
  }
}

export const resolvers: Resolvers = {
  Mutation: {
    checkImportProject: async (root, { path: dir }) => checkImportProject(dir),
  },
}
