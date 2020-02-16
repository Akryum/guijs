import { gql } from '@apollo/client/core'

export const terminalFragment = gql`
fragment terminal on Terminal {
  id
  name
  title
  cwd
}
`
