import { gql } from '@apollo/client/core'

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
