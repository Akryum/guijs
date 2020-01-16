<script>
import { computed } from '@vue/composition-api'

const command = navigator.platform === 'MacIntel' ? '⌘' : 'ctrl'

export default {
  props: {
    sequence: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const display = computed(() => props.sequence.replace(/mod/g, command))

    return {
      display,
    }
  },
}
</script>

<template>
  <div class="text-sm text-gray-500 border-gray-300 dark:border-black border px-2 rounded font-mono">
    {{ display }}
  </div>
</template>
