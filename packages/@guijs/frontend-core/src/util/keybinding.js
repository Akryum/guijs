import { apolloClient } from '../apollo'
import gql from 'graphql-tag'
import { applyKeybindings } from '@guijs/frontend-ui/util/keybinding'

export * from '@guijs/frontend-ui/util/keybinding'

apolloClient.watchQuery({
  query: gql`
    query getKeybindings {
      keybindings {
        id
        sequences
        scope
        global
      }
    }
  `,
}).subscribe((result) => {
  applyKeybindings(result.data.keybindings)
})
