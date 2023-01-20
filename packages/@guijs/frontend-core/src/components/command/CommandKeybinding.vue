<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

export default {
  props: {
    commandId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result } = useQuery(gql`
      query commandKeybinding ($commandId: ID!) {
        command (id: $commandId) {
          id
          keybinding {
            id
            sequences
          }
        }
      }
    `, props)

    const sequences = computed(() => result.value?.command.keybinding.sequences ?? [])

    return {
      sequences,
    }
  },
}
</script>

<template>
  <VKeybinding
    v-if="sequences.length"
    :sequence="sequences[0]"
  />
</template>
