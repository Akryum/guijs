import { useRoute } from 'vue-router/composables'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
import { projectWorkspaceFragment } from './fragments'

export function useCurrentWorkspace () {
  const route = useRoute()

  const { result, loading } = useQuery(gql`
    query currentWorkspace ($projectId: ID!, $workspaceId: ID!) {
      project (id: $projectId) {
        id
        workspace (id: $workspaceId) {
          ...projectWorkspace
        }
      }
    }
    ${projectWorkspaceFragment}
  `, () => ({
    projectId: route.params.projectId,
    workspaceId: route.params.workspaceId,
  }), () => ({
    enabled: !!(route.params.projectId && route.params.workspaceId),
  }))

  const workspace = computed(() => result.value?.project.workspace)

  return {
    workspace,
    loading,
  }
}
