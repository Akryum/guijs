<script>
import { computed } from '@vue/composition-api'
export default {
  props: {
    error: {
      type: [String, Error, Object],
      default: null,
    },
  },

  setup (props) {
    return {
      message: computed(() => {
        // GraphQL
        {
          const messages = []
          if (props.error.graphQLErrors) {
            messages.push(...props.error.graphQLErrors.map(e => e.message))
          }
          if (props.error.networkError) {
            messages.push(props.error.networkError)
          }
          if (messages.length) return messages.join('\n')
        }

        return props.error.message || props.error
      }),
    }
  },
}
</script>

<template>
  <div
    v-if="error"
    class="flex items-center text-red-500 p-4 my-6 border-red-300 dark:border-red-700 border rounded overflow-x-hidden"
  >
    <i class="material-icons mr-3">error</i>
    <div class="flex-auto whitespace-pre-wrap break-words">
      {{ $t(message) }}
    </div>
  </div>
</template>
