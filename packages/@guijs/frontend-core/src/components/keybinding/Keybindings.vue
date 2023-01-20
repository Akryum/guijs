<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'
export default {
  props: {
    keybindingId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result } = useQuery(gql`
      query keybinding ($keybindingId: ID!) {
        keybinding (id: $keybindingId) {
          id
          description
          scope
          sequences
        }
      }
    `, props)

    const sequences = computed(() => result.value?.keybinding.sequences ?? [])

    return {
      sequences,
    }
  },
}
</script>

<template>
  <div class="flex">
    <VKeybinding
      v-for="(s, index) of sequences"
      :key="s"
      :sequence="s"
      :class="{
        'ml-2': index > 0,
      }"
    />
  </div>
</template>
