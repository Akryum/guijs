import gql from 'graphql-tag'

export const projectPackageFragment = gql`
fragment projectPackage on ProjectPackage {
  id
  metadataId
  type
  projectTypes {
    id
    name
    slug
    logo
  }
  versionSelector
  currentVersion
  latestVersion
  isWorkspace
  official
  description
  defaultLogo
}
`
