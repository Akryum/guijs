<script>
export default {
  props: {
    icon: {
      type: String,
      default: null,
    },
  },
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center justify-center p-4 h-full">
      <i
        v-if="icon"
        class="material-icons text-gray-400"
      >{{ icon }}</i>
      <div class="flex flex-col items-center text-gray-500">
        <slot />
      </div>
    </div>
  </div>
</template>
