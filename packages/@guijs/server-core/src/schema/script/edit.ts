import gql from 'graphql-tag'
import { Resolvers, CommandType } from '@/generated/schema'
import { MetaNpmScript } from './meta-types'
import { getScriptWorkspace } from '.'
import fs from 'fs-extra'
import path from 'path'
import { addCommand } from '../command'

export const typeDefs = gql`
extend type Mutation {
  editNpmScript (input: EditNpmScriptInput!): NpmScript!
  renameNpmScript (input: RenameNpmScriptInput!): NpmScript!
}

input EditNpmScriptInput {
  scriptId: ID!
  command: String!
}

input RenameNpmScriptInput {
  scriptId: ID!
  name: String!
}
`

export const resolvers: Resolvers = {
  Mutation: {
    editNpmScript: async (root, { input }, ctx) => {
      const script = await ctx.db.scripts.findOne<MetaNpmScript>({ _id: input.scriptId })
      if (!script) {
        throw new Error(`Script ${input.scriptId} not found`)
      }

      // Update script on disk
      const { workspace } = await getScriptWorkspace(script, ctx)
      const pkgFile = path.resolve(workspace.absolutePath, 'package.json')
      const pkg = await fs.readJson(pkgFile)
      pkg.scripts[script.name] = input.command
      await fs.writeJson(pkgFile, pkg, { spaces: 2 })

      // Update script in memory
      script.command = input.command
      await ctx.db.scripts.update({
        _id: input.scriptId,
      }, {
        $set: {
          command: input.command,
        },
      })

      return script
    },

    renameNpmScript: async (root, { input }, ctx) => {
      const script = await ctx.db.scripts.findOne<MetaNpmScript>({ _id: input.scriptId })
      if (!script) {
        throw new Error(`Script ${input.scriptId} not found`)
      }

      // Update script on disk
      const { workspace } = await getScriptWorkspace(script, ctx)
      const pkgFile = path.resolve(workspace.absolutePath, 'package.json')
      const pkg = await fs.readJson(pkgFile)
      delete pkg.scripts[script.name]
      pkg.scripts[input.name] = script.command
      await fs.writeJson(pkgFile, pkg, { spaces: 2 })

      // Update script in memory
      script.name = input.name
      await ctx.db.scripts.update({
        _id: input.scriptId,
      }, {
        $set: {
          name: input.name,
        },
      })

      return script
    },
  },
}

addCommand({
  id: 'edit-script',
  type: CommandType.Action,
  label: 'Edit script',
  hidden: true,
})

addCommand({
  id: 'rename-script',
  type: CommandType.Action,
  label: 'Edit script',
  hidden: true,
})
