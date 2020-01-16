import gql from 'graphql-tag'
import { Resolvers } from '@/generated/schema'
import { selectFile } from '@guijs/native-dialog'

export const typeDefs = gql`
extend type Mutation {
  selectFile (input: SelectFileInput!): String
}

input SelectFileInput {
  cwd: String
  directory: Boolean
}
`

export const resolvers: Resolvers = {
  Mutation: {
    selectFile: async (root, { input }) => {
      const [file] = await selectFile({
        cwd: input.cwd || process.cwd(),
        directory: input.directory,
      })
      return file
    },
  },
}
