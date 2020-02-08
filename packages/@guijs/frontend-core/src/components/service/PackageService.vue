<script>
import { onCommand } from '@/util/command'
import { useRouter } from '@/util/router'

export default {
  setup () {
    const router = useRouter()

    onCommand('show-package', async (cmd, payload) => {
      router.push({
        name: 'project-type-packages',
        params: {
          workspaceId: payload.workspaceId,
          projectTypeId: payload.projectTypeId,
        },
        query: {
          packageId: payload.packageId,
        },
      })
    })
  },
}
</script>
