import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useRoute } from './router'
import { computed } from '@vue/composition-api'

export function useCurrentProject (fragment = '') {
  const route = useRoute()

  const projectId = computed(() => route.value.params.projectId)

  const { result, loading } = useQuery(gql`
    query currentProject ($id: ID!) {
      project (id: $id) {
        id
        name
        bookmarked
        ${fragment}
      }
    }
  `, () => ({
    id: projectId.value,
  }), () => ({
    enabled: !!projectId.value,
  }))

  const project = computed(() => {
    if (projectId.value && result.value && result.value.project) {
      return result.value.project
    }
    return null
  })

  return {
    project,
    loading,
  }
}
