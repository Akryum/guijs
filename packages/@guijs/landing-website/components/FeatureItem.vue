<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div class="border border-gray-800 rounded p-6 max-w-64">
    <div class="text-yellow-500 text-lg mb-4">
      {{ title }}
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
