import gql from 'graphql-tag'

export const packageMetadataFragment = gql`
fragment packageMetadata on PackageMetadata {
  id
  awesomejsId
  projectTypes {
    id
    name
    slug
    logo
  }
  latestVersion
  official
  description
  defaultLogo
}
`

export const projectPackageFragment = gql`
fragment projectPackage on ProjectPackage {
  id
  type
  versionSelector
  currentVersion
  isWorkspace
  metadata {
    ...packageMetadata
  }
}
${packageMetadataFragment}
`
