<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import ScriptListItem from './ScriptListItem.vue'

export default {
  components: {
    ScriptListItem,
  },

  setup () {
    const route = useRoute()

    const { result } = useQuery(gql`
      query workspaceScripts ($projectId: ID!, $workspaceId: ID!) {
        project (id: $projectId) {
          id
          workspace (id: $workspaceId) {
            id
            scripts {
              ...script
            }
          }
        }
      }
      ${scriptFragment}
    `, () => ({
      projectId: route.value.params.projectId,
      workspaceId: route.value.params.workspaceId,
    }))

    const scripts = useResult(result, [], data => data.project.workspace.scripts)

    return {
      scripts,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch mt-6">
    <ScriptListItem
      v-for="script of scripts"
      :key="script.id"
      :script="script"
    />
  </div>
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-primary-100;
  .mode-dark & {
    @apply bg-primary-900;
  }
}
</style>
