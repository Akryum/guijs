<script>
export default {
  props: {
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
      src="~@/assets/error.svg"
      alt="Downloading"
    >

    <div class="mt-8 text-gray-700 dark:text-gray-300">
      {{ label }}
    </div>

    <div class="mt-8 text-gray-500">
      <slot />
    </div>
  </div>
</template>
