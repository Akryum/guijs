import { gql } from '@apollo/client/core'

export const scriptFragment = gql`
fragment script on NpmScript {
  id
  name
  command
  status
}
`
