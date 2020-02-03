import { addCommand } from '../command'
import { CommandType, Resolvers } from '@/generated/schema'
import { addKeybinding } from '../keybinding'
import gql from 'graphql-tag'
import fs from 'fs-extra'
import path from 'path'

export const typeDefs = gql`
type NpmScript {
  id: ID!
  name: String!
  command: String!
}

extend type ProjectWorkspace {
  scripts: [NpmScript!]!
}
`

export const resolvers: Resolvers = {
  ProjectWorkspace: {
    scripts: async (workspace) => {
      const pkg = await fs.readJson(path.join(workspace.absolutePath, 'package.json'))
      if (pkg.scripts) {
        const result = []
        for (const key in pkg.scripts) {
          result.push({
            id: `${workspace.absolutePath}:${key}`,
            name: key,
            command: pkg.scripts[key],
          })
        }
        return result
      }
      return []
    },
  },
}

addCommand({
  id: 'show-scripts',
  type: CommandType.Action,
  label: 'Show scripts',
  description: 'guijs.script.show-scripts',
})

addKeybinding({
  id: 'show-scripts',
  scope: 'root',
  sequences: ['s'],
})
