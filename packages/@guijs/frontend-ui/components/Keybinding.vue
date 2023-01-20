<script>
import { computed } from 'vue'

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
  <div class="keybinding text-sm text-gray-500 border-gray-300 dark:border-gray-600 border px-2 rounded font-mono">
    {{ display }}
  </div>
</template>

<style lang="postcss" scoped>
.keybinding {
  .v-popper--theme-tooltip & {
    @apply border-gray-600;

    .mode-dark & {
      @apply border-gray-300;
    }
  }
}
</style>
