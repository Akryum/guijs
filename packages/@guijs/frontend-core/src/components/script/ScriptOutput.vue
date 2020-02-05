<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import { terminalFragment } from '../terminal/fragments'
import Terminal from '../terminal/Terminal.vue'

export default {
  components: {
    Terminal,
  },

  setup () {
    const route = useRoute()

    const { result } = useQuery(gql`
      query script ($id: ID!) {
        script (id: $id) {
          ...script
          terminal {
            ...terminal
          }
        }
      }
      ${scriptFragment}
      ${terminalFragment}
    `, () => ({
      id: route.value.params.scriptId,
    }), () => ({
      enabled: !!route.value.params.scriptId,
    }))
    const terminal = useResult(result, null, data => data.script.terminal)

    return {
      terminal,
    }
  },
}
</script>

<template>
  <div
    v-if="terminal"
    class="border-gray-200 border rounded"
  >
    <Terminal
      :terminalId="terminal.id"
      class="w-full h-full"
    />
  </div>
</template>
