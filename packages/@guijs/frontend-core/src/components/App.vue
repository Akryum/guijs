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
    <div class="flex-1 flex flex-col overflow-hidden">
      <router-view class="flex-1 overflow-hidden" />
    </div>

    <StatusBar class="flex-none" />
  </div>
</template>

<style>
@import '~@guijs/frontend-ui/styles/tailwind.postcss';
</style>
