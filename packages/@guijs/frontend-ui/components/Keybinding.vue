<script>
export default {
  props: {
    sequence: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div class="text-sm text-gray-500 border-gray-300 border px-2 rounded font-mono">
    {{ sequence }}
  </div>
</template>
