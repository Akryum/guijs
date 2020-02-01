<script>
export default {
  props: {
    title: {
      type: String,
      default: null,
    },

    shellClass: {
      type: [String, Object, Array],
      default: 'max-w-192',
    },

    locked: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div class="fixed inset-0 flex flex-col items-center py-16 z-10">
    <!-- Backdrop -->
    <div
      class="bg-white dark:bg-gray-900 opacity-90 absolute inset-0"
      @click="!locked && $emit('close')"
    />

    <!-- Shell -->
    <div
      class="relative z-10 w-screen bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-950 rounded shadow-lg"
      :class="shellClass"
    >
      <!-- Titlebar -->
      <div class="flex items-stretch border-b border-gray-200 dark:border-gray-950">
        <div class="flex-1 h-72p">
          <slot name="title">
            {{ title }}
          </slot>
        </div>

        <VButton
          v-if="!locked"
          class="w-72p h-72p group"
          @click="$emit('close')"
        >
          <i class="material-icons text-2xl text-gray-500 group-hover:text-gray-800 dark-group-hover:text-gray-200">close</i>
        </VButton>
      </div>

      <!-- Body -->
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.modal-title {
  @apply h-full flex items-center text-gray-500 text-xl px-6;
}
</style>
