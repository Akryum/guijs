<script>
import StatusBar from './status-bar/StatusBar.vue'

export default {
  components: {
    StatusBar,
  },
}
</script>

<template>
  <div
    id="app"
    class="w-screen h-screen overflow-hidden flex flex-col items-stretch"
  >
    <router-view />

    <StatusBar class="flex-none" />
  </div>
</template>

<style>
@import '~@guijs/frontend-ui/styles/tailwind.postcss';
</style>
