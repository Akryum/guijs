<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div class="flex flex-col items-center">
    <img
      src="~@/assets/update.svg"
      alt="Downloading"
    >

    <div class="mt-8 text-gray-700 dark:text-gray-300">
      {{ label }}
    </div>

    <div class="mt-8 h-2 w-full bg-gray-200 dark:bg-gray-950 rounded-full  overflow-hidden">
      <div
        v-if="progress === -1"
        class="bar w-32 h-full bg-gray-500 rounded-full"
      />

      <div
        v-else
        class="h-full bg-gray-500 rounded-full"
        :style="{
          width: `${progress*100}%`,
        }"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.bar {
  animation: bar-move 2s linear infinite;
}

@keyframes bar-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(500%);
  }
}
</style>
