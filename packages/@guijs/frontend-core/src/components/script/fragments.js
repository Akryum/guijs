import gql from 'graphql-tag'

export const scriptFragment = gql`
fragment script on NpmScript {
  id
  name
  command
  status
}
`
