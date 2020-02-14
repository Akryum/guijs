<script>
export default {
  methods: {
    update () {
      // @TODO
    },

    skip () {
      // @TODO
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
