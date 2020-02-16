import { gql } from '@apollo/client/core'

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
