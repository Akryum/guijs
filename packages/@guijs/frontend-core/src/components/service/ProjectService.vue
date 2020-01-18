<script>
import { onCommand, runCommand } from '@/util/command'
import { useRouter, useRoute } from '@/util/router'
import { watch } from '@vue/composition-api'

export default {
  setup () {
    const router = useRouter()
    const route = useRoute()

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

    // Dispatch project open (after)
    watch(() => route.value.params.projectId, value => {
      if (value) {
        runCommand('open-project-apply', {
          projectId: value,
        })
      }
    })
  },
}
</script>
