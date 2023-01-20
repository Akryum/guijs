<script>
import { useRoute } from 'vue-router/composables'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import ScriptListItem from './ScriptListItem.vue'
import { computed } from 'vue'

export default {
  components: {
    ScriptListItem,
  },

  setup () {
    const route = useRoute()

    const { result, loading } = useQuery(gql`
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
      projectId: route.params.projectId,
      workspaceId: route.params.workspaceId,
    }), {
      fetchPolicy: 'cache-and-network',
    })

    const scripts = computed(() => result.value?.project.workspace.scripts ?? [])

    return {
      scripts,
      loading,
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

    <VEmpty
      v-if="!loading && !scripts.length"
      icon="assignment"
    >
      {{ $t('guijs.script.no-scripts') }}
    </VEmpty>
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
