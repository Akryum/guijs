import gql from 'graphql-tag'

export const projectWorkspaceFragment = gql`
fragment projectWorkspace on ProjectWorkspace {
  id
  name
  absolutePath
  relativePath
  type {
    id
    name
    logo
  }
}
`
