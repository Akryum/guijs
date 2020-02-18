import gql from 'graphql-tag'

export const taskFragment = gql`
fragment task on Task {
  id
  payload
  status
  progress
  message
}
`
