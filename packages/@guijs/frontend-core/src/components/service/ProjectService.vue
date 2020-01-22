<script>
import { onCommand, runCommand } from '@/util/command'
import { useRouter, useRoute } from '@/util/router'
import { watch, computed } from '@vue/composition-api'

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

    const projectId = computed(() => route.value.params.projectId)

    // On open project, reload the page
    watch(projectId, value => {
      if (value) {
        // @TODO find a better way?
        location.reload()
      }
    }, {
      lazy: true,
    })

    // Dispatch project open (after)
    if (projectId.value) {
      runCommand('open-project-apply', {
        projectId: projectId.value,
      })
    }

    // Project close
    window.addEventListener('beforeunload', () => {
      if (!projectId.value) return
      runCommand('close-project-apply', {
        projectId: projectId.value,
      })
    })

    onCommand('close-project', () => {
      if (!projectId.value) return
      window.location.assign('/')
    })
  },
}
</script>
