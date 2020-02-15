import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
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
    projectId: route.value.params.projectId,
    workspaceId: route.value.params.workspaceId,
  }), () => ({
    enabled: !!(route.value.params.projectId && route.value.params.workspaceId),
  }))

  const workspace = useResult(result, null, data => data.project.workspace)

  return {
    workspace,
    loading,
  }
}
