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
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9Ijg2IiB2aWV3Qm94PSIwIDAgMTI4IDg2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTAzLjIgMzIuMjEzM0MxMDEuNDA5IDIzLjEzNDUgOTYuNTIwNiAxNC45NTkyIDg5LjM3MSA5LjA4Mzk4QzgyLjIyMTUgMy4yMDg3MSA3My4yNTM5IC0wLjAwMjA5MTk2IDY0IDEuMDIyNmUtMDZDNDguNTg2NyAxLjAyMjZlLTA2IDM1LjIgOC43NDY2NyAyOC41MzMzIDIxLjU0NjdDMjAuNjk0NiAyMi4zOTM4IDEzLjQ0NTQgMjYuMTA3OCA4LjE3ODYxIDMxLjk3NUMyLjkxMTg1IDM3Ljg0MjMgLTAuMDAwOTE1NzQzIDQ1LjQ0ODkgMi4xNTk2MWUtMDcgNTMuMzMzM0MyLjE1OTYxZS0wNyA3MC45ODY3IDE0LjM0NjcgODUuMzMzMyAzMiA4NS4zMzMzSDEwMS4zMzNDMTE2LjA1MyA4NS4zMzMzIDEyOCA3My4zODY3IDEyOCA1OC42NjY3QzEyOCA0NC41ODY3IDExNy4wNjcgMzMuMTczMyAxMDMuMiAzMi4yMTMzWk05MC42NjY3IDQ4TDY0IDc0LjY2NjdMMzcuMzMzMyA0OEg1My4zMzMzVjI2LjY2NjdINzQuNjY2N1Y0OEg5MC42NjY3WiIgZmlsbD0iI0YwRjBGMCIvPgo8L3N2Zz4K"
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
