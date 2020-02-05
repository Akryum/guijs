import gql from 'graphql-tag'

export const terminalFragment = gql`
fragment terminal on Terminal {
  id
  name
  title
  cwd
}
`
