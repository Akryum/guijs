<script>
import { emit } from '@tauri-apps/api/event'

export default {
  methods: {
    update () {
      emit('update')
    },

    skip () {
      emit('skip-update')
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
      An update is available. Do you want to download it now?
    </div>

    <div class="mt-8">
      <button
        class="w-32 h-12 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark-hover:bg-gray-400 rounded"
        @click="skip()"
      >
        Skip
      </button>

      <button
        class="w-32 h-12 ml-8 text-white bg-blue-600 hover:bg-blue-500 dark:text-black dark:bg-blue-400 dark-hover:bg-blue-300 rounded"
        @click="update()"
      >
        Update
      </button>
    </div>
  </div>
</template>
