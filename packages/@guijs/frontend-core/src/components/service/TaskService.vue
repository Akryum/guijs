<script>
import { useSubscription } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { taskFragment } from '../task/fragments'

export default {
  setup () {
    useSubscription(gql`
      subscription taskUpdated {
        taskUpdated {
          ...task
        }
      }
      ${taskFragment}
    `)
  },
}
</script>
