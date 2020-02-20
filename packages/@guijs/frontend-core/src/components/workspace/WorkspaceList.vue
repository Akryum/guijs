<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectWorkspaceFragment } from './fragments'
import { ref, computed } from '@vue/composition-api'
import { bindScope } from '@/util/keybinding'
import { useKeyboardNavigation } from '@guijs/frontend-ui/util/navigation'
import ProjectTypeLogo from '../project/ProjectTypeLogo.vue'

export default {
  components: {
    ProjectTypeLogo,
  },

  setup (props, { emit }) {
    const route = useRoute()

    const { result } = useQuery(gql`
      query projectWorkspaces ($projectId: ID!) {
        project (id: $projectId) {
          id
          workspaces {
            ...projectWorkspace
          }
        }
      }
      ${projectWorkspaceFragment}
    `, () => ({
      projectId: route.value.params.projectId,
    }), {
      fetchPolicy: 'cache-and-network',
    })

    const workspaces = useResult(result, [], data => data.project.workspaces)

    // Search
    const searchText = ref('')

    const filteredList = computed(() => {
      const text = searchText.value.trim()

      if (text) {
        const reg = new RegExp(text.replace(/\s+/g, '|'), 'i')
        return workspaces.value.filter(w => w.name.match(reg) || w.relativePath.match(reg))
      }

      return workspaces.value
    })

    // Keybindings
    bindScope('workspace-list')

    const { selectedIndex, onSelect } = useKeyboardNavigation(filteredList, 'workspace-list')

    onSelect(workspace => {
      emit('select', workspace.id)
    })

    return {
      result,
      searchText,
      filteredList,
      selectedIndex,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch max-h-128 overflow-y-auto">
    <template v-if="result">
      <VInput
        v-model="searchText"
        :placeholder="$t('guijs.common.search')"
        class="p-4 border-gray-200 dark:border-gray-950 border-b"
        autoFocus
      />

      <VButton
        v-for="(w, index) of filteredList"
        :key="w.id"
        v-tooltip.right="$t('guijs.workspace.select-button', { name: w.name, type: w.type.name })"
        class="p-4"
        :class="{
          'bg-primary-100 dark:bg-primary-900': index === selectedIndex,
        }"
        align="left"
        extend
        square
        @mouseover.native="selectedIndex = index"
        @click="$emit('select', w.id)"
      >
        <ProjectTypeLogo
          :projectType="w.type"
          class="w-6 h-6 rounded mr-4 flex-none"
        />
        <div class="text-left flex-1 overflow-hidden w-0">
          <div class="truncate">
            {{ w.name }}
          </div>
          <div class="truncate text-gray-500">
            {{ w.relativePath || $t('guijs.workspace.root') }}
          </div>
        </div>
      </VButton>
    </template>
    <div
      v-else
      class="text-center py-6 text-gray-500"
    >
      <i class="material-icons">more_horiz</i>
    </div>
  </div>
</template>
