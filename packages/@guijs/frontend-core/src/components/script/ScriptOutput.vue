<script>
import gql from 'graphql-tag'
import { computed } from 'vue'
import { useScriptQuery } from './useScript'
import { scriptFragment } from './fragments'
import { terminalFragment } from '../terminal/fragments'
import Terminal from '../terminal/Terminal.vue'

export default {
  components: {
    Terminal,
  },

  setup () {
    const { script } = useScriptQuery(gql`
      query script ($scriptId: ID!) {
        script (id: $scriptId) {
          ...script
          terminal {
            ...terminal
          }
        }
      }
      ${scriptFragment}
      ${terminalFragment}
    `)
    const terminal = computed(() => script.value?.terminal)

    return {
      terminal,
    }
  },
}
</script>

<template>
  <div
    class="border-gray-200 dark:border-gray-950 border rounded"
  >
    <Terminal
      v-if="terminal"
      :key="terminal.id"
      :terminalId="terminal.id"
      class="w-full h-full"
    />
  </div>
</template>
