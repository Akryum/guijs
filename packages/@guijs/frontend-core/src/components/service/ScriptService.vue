<script>
import { onCommand } from '@/util/command'
import { useRouter } from 'vue-router/composables'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from '../script/fragments'

export default {
  setup () {
    const router = useRouter()

    onCommand('toggle-run-script', async (cmd, payload) => {
      router.push({
        name: 'project-script',
        params: {
          workspaceId: payload.workspaceId,
          projectTypeId: payload.projectTypeId,
          scriptId: payload.scriptId,
        },
      })
    })

    useSubscription(gql`
      subscription npmScriptUpdated {
        npmScriptUpdated {
          ...script
        }
      }
      ${scriptFragment}
    `)
  },
}
</script>
