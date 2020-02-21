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
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTIiIGhlaWdodD0iOTIiIHZpZXdCb3g9IjAgMCA5MiA5MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ2IDBDMjAuNjA4IDAgMCAyMC42MDggMCA0NkMwIDcxLjM5MiAyMC42MDggOTIgNDYgOTJDNzEuMzkyIDkyIDkyIDcxLjM5MiA5MiA0NkM5MiAyMC42MDggNzEuMzkyIDAgNDYgMFpNNTAuNiA2OUg0MS40VjU5LjhINTAuNlY2OVpNNTAuNiA1MC42SDQxLjRWMjNINTAuNlY1MC42WiIgZmlsbD0iI0ZGRTFDNiIvPgo8L3N2Zz4K"
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
