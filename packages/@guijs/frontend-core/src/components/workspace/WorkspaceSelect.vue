<script>
import { ref, watch } from '@vue/composition-api'
import { useRouter, useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectWorkspaceFragment } from './fragments'
import { onKeybind } from '@/util/keybinding'
import Keybindings from '../keybinding/Keybindings.vue'
import ProjectTypeLogo from '../project/ProjectTypeLogo.vue'
import WorkspaceList from './WorkspaceList.vue'

export default {
  components: {
    Keybindings,
    ProjectTypeLogo,
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

    function resetWorkspaceSelection () {
      router.push({
        params: {
          workspaceId: '__root',
        },
      })
    }

    // Auto select __root
    watch(route, value => {
      if (!route.value.params.workspaceId) {
        resetWorkspaceSelection()
      }
    })

    // Current workspace
    const { result, onResult } = useQuery(gql`
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
      fetchPolicy: 'network-only',
    }))
    const currentWorkspace = useResult(result, null, data => data.project.workspace)

    // Reset selection if workspace doesn't exist
    onResult(result => {
      if (!result.loading && !currentWorkspace.value) {
        resetWorkspaceSelection()
      }
    })

    // Keybindings

    onKeybind('workspace-select', () => {
      isOpen.value = !isOpen.value
    })

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
      <VTooltip>
        <VButton
          iconRight="keyboard_arrow_down"
          class="w-full btn-md h-72p hover:bg-primary-100 dark-hover:bg-primary-900"
          square
          align="left"
          extend
        >
          <template v-if="currentWorkspace">
            <ProjectTypeLogo
              :projectType="currentWorkspace.type"
              class="w-6 h-6 rounded mr-4 flex-none"
            />
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

        <template #popper>
          <div>
            {{ $t('guijs.workspace.tooltip') }}
          </div>
          <div class="flex">
            <span class="text-gray-500 mr-2">{{ $t('guijs.workspace.action') }}</span>
            <Keybindings keybindingId="workspace-select" />
          </div>
        </template>
      </VTooltip>
    </div>

    <template #popper>
      <WorkspaceList
        class="w-64"
        @select="select"
      />
    </template>
  </VPopper>
</template>
