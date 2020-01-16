<script>
export default {
  setup () {

  },
}
</script>

<template>
  <div
    class="bg-gray-100 border-gray-200 border-r w-64
    dark:bg-gray-900 dark:border-gray-950"
  >
    <VEmpty class="mt-8">
      <svg
        width="29"
        height="30"
        viewBox="0 0 29 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="mb-4"
      >
        <path
          d="M1.5 7V21.9998L14.5 29M1.5 7L14.5 14.0002M1.5 7L14.5 0L27.5 7M14.5 14.0002V29M14.5 14.0002L27.5 7M14.5 29L27.5 21.9998V7"
          stroke-width="2"
          stroke-linejoin="round"
          class="box-path"
        />
      </svg>
      <div class="text-sm">
        No project open
      </div>
    </VEmpty>
  </div>
</template>

<style lang="postcss" scoped>
.box-path {
  stroke: theme('colors.gray.300');

  .mode-dark & {
    stroke: theme('colors.gray.600');
  }
}
</style>
