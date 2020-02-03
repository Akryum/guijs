<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'

export default {
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
  <div class="flex flex-col items-stretch mt-4">
    <VButton
      v-for="script of scripts"
      :key="script.id"
      :to="{
        name: 'project-script',
        params: {
          ...$route.params,
          scriptId: script.id,
        }
      }"
      align="left"
      square
      extend
      class="btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
      :class="{
        active: $route.params.scriptId === script.id,
      }"
    >
      <div class="w-6 mr-4 flex items-center justify-center">
        <div class="w-3 h-3 bg-gray-500 rounded-full" />
      </div>
      <div class="flex-1 text-left w-0 truncate">
        {{ script.name }}
      </div>
    </VButton>
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
