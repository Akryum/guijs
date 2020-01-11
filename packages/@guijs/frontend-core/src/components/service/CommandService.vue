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
          id
        }
      }
    `)
    onResult(result => {
      console.log(result)
      dispatchCommand(result.data.commandRan.id)
    })

    // Try Keybinding
    onAnyKeybind(async (id) => {
      await runCommand(id)
    })

    return {}
  },

  render () {
    return null
  },
}
</script>
