import gql from 'graphql-tag'

export const commandWithKeybindingFragment = gql`
fragment command on Command {
  id
  type
  label
  icon
  description
  keybinding {
    id
    sequences
  }
}
`
