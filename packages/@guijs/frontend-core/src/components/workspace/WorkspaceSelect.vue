<script>
import WorkspaceList from './WorkspaceList.vue'
import { ref, watch } from '@vue/composition-api'
import { useRouter, useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectWorkspaceFragment } from './fragments'

export default {
  components: {
    WorkspaceList,
  },

  setup () {
    const isOpen = ref(false)
    const router = useRouter()
    const route = useRoute()

    function select (id) {
      router.push({
        params: {
          workspaceId: id,
        },
      })
      isOpen.value = false
    }

    // Auto select __root
    watch(route, value => {
      if (!route.value.params.workspaceId) {
        router.push({
          params: {
            workspaceId: '__root',
          },
        })
      }
    })

    // Current workspace
    const { result } = useQuery(gql`
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
      enabled: !!route.value.params.workspaceId,
    }))
    const currentWorkspace = useResult(result, null, data => data.project.workspace)

    return {
      isOpen,
      select,
      currentWorkspace,
    }
  },
}
</script>

<template>
  <VPopper
    :open.sync="isOpen"
  >
    <div class="overflow-hidden">
      <VButton
        iconRight="keyboard_arrow_down"
        class="w-full btn-md h-72p hover:bg-primary-100 dark-hover:bg-primary-900"
        square
        align="left"
        extend
      >
        <template v-if="currentWorkspace">
          <img
            :src="currentWorkspace.type.logo"
            :alt="currentWorkspace.type.name"
            class="w-6 h-6 rounded mr-4 flex-none"
          >
          <div
            class="flex-1 w-0 truncate text-left leading-normal"
          >
            {{ currentWorkspace.name }}
          </div>
        </template>
        <template v-else>
          ...
        </template>
      </VButton>
    </div>

    <template #popper>
      <WorkspaceList
        class="w-64"
        @select="select"
      />
    </template>
  </VPopper>
</template>
