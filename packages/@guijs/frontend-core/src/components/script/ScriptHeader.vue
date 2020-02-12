<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import ScriptStatusIndicator from './ScriptStatusIndicator.vue'

export default {
  components: {
    ScriptStatusIndicator,
  },

  setup () {
    const route = useRoute()

    const { result } = useQuery(gql`
      query script ($id: ID!) {
        script (id: $id) {
          ...script
        }
      }
      ${scriptFragment}
    `, () => ({
      id: route.value.params.scriptId,
    }), () => ({
      enabled: !!route.value.params.scriptId,
    }))
    const script = useResult(result)

    return {
      script,
    }
  },
}
</script>

<template>
  <div
    v-if="$route.params.scriptId && script"
    class="flex items-center h-full px-6"
  >
    <ScriptStatusIndicator
      :key="script.id"
      :scriptId="script.id"
      class="flex-none mr-4"
    />

    <div class="flex-1 text-left w-0 truncate">
      {{ script.name }}

      <span class="ml-6 text-gray-500 font-mono text-sm">
        {{ script.command }}
      </span>
    </div>
  </div>
</template>
