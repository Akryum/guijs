<script>
import SidePane from './side-pane/SidePane.vue'
import StatusBar from './status-bar/StatusBar.vue'

export default {
  components: {
    SidePane,
    StatusBar,
  },
}
</script>

<template>
  <div
    id="app"
    class="w-screen h-screen overflow-hidden flex flex-col items-stretch"
  >
    <div class="flex-1 flex overflow-hidden">
      <SidePane class="flex-none" />

      <router-view class="flex-1 overflow-hidden" />
    </div>

    <StatusBar class="flex-none" />
  </div>
</template>

<style>
@import '~@guijs/frontend-ui/styles/tailwind.postcss';
</style>
