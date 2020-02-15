<script>
import { onCommand } from '@/util/command'
import { useRouter } from '@/util/router'
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectPackageFragment } from '../pkg/fragments'

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

    useSubscription(gql`
      subscription projectPackageUpdated {
        projectPackageUpdated {
          ...projectPackage
        }
      }
      ${projectPackageFragment}
    `)
  },
}
</script>
