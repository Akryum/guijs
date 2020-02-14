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

    <div class="mt-8 h-2 w-full bg-gray-200 dark:bg-gray-950 rounded-full">
      <div
        class="h-full bg-gray-500 rounded-full"
        :style="{
          width: `${progress*100}%`,
        }"
      />
    </div>
  </div>
</template>
