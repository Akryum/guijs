<script>
export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="mb-6 border border-gray-200 dark:border-gray-950 rounded p-6">
    {{ pkg.id }}
  </div>
</template>
