<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
export default {
  props: {
    scriptId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result } = useQuery(gql`
      query scriptStatus ($scriptId: ID!) {
        script (id: $scriptId) {
          id
          status
        }
      }
    `, props)
    const status = useResult(result, 'idle', data => data.script.status)

    return {
      status,
    }
  },
}
</script>

<template>
  <div class="w-6 h-6 flex items-center justify-center">
    <div
      v-if="status === 'idle'"
      class="w-3 h-3 bg-gray-500 rounded-full"
    />

    <div
      v-if="status === 'running'"
      class="w-5 h-5 border-blue-400 dark:border-blue-600 border-4 rounded-full"
    />

    <img
      v-if="status !== 'idle' && status !== 'running'"
      :src="require(`@/assets/script-${status}.svg`)"
      class="w-5 h-5"
    >
  </div>
</template>
