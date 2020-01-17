<script>
import { onCommand } from '@/util/command'
import { useRouter } from '@/util/router'

export default {
  setup () {
    const router = useRouter()

    onCommand('open-project', (cmd, payload) => {
      if (!router.currentRoute.params.projectId) {
        router.push({
          name: 'project-home',
          params: {
            projectId: payload.projectId,
          },
        })
      } else {
        router.push({
          params: {
            projectId: payload.projectId,
          },
        })
      }
    })
  },
}
</script>
