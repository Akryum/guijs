<script>
import { onAnyKeybind } from '@/util/keybinding'
import { runCommand, dispatchCommand } from '@/util/command'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  setup () {
    // Dispatch commands
    const { onResult } = useSubscription(gql`
      subscription commandRan {
        commandRan {
          command {
            id
            type
          }
          payload
        }
      }
    `)
    onResult(({ data }) => {
      dispatchCommand(data.commandRan.command, data.commandRan.payload || {})
    })

    // Try Keybinding
    onAnyKeybind(async (id) => {
      await runCommand(id)
    })

    return {}
  },
}
</script>
