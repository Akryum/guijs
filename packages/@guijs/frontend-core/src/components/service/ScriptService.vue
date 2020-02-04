<script>
import { onCommand } from '@/util/command'
import { useRouter } from '@/util/router'

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
  },
}
</script>
