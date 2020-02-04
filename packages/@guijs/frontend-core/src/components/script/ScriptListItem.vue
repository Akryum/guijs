<script>
export default {
  props: {
    script: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <VButton
    :to="{
      name: 'project-script',
      params: {
        ...$route.params,
        scriptId: script.id,
      }
    }"
    align="left"
    square
    extend
    class="btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
    :class="{
      active: $route.params.scriptId === script.id,
    }"
  >
    <div class="w-6 mr-4 flex items-center justify-center">
      <div class="w-3 h-3 bg-gray-500 rounded-full" />
    </div>
    <div class="flex-1 text-left w-0 truncate">
      {{ script.name }}
    </div>
  </VButton>
</template>
