<script>
export default {
  props: {
    projectTypes: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch">
    <VButton
      v-for="pt of projectTypes"
      :key="pt.id"
      align="left"
      square
      extend
      class="btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
    >
      <img
        :src="pt.logo"
        alt="Logo"
        class="w-6 h-6 rounded mr-4 flex-none"
      >
      <div class="flex-1 text-left w-0 truncate">
        {{ pt.name }}
      </div>
    </VButton>
  </div>
</template>
