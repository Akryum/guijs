<script>
import AllServices from './AllServices.vue'
import AllModals from './AllModals.vue'
import SidePane from './side-pane/SidePane.vue'
import StatusBar from './status-bar/StatusBar.vue'

export default {
  components: {
    AllServices,
    AllModals,
    SidePane,
    StatusBar,
  },
}
</script>

<template>
  <div
    id="app"
    class="w-screen h-screen overflow-hidden flex flex-col items-stretch
    bg-white dark:bg-gray-850 dark:text-gray-100"
  >
    <div class="flex-1 flex items-stretch overflow-hidden">
      <SidePane class="flex-none" />

      <div class="flex-1 overflow-y-auto">
        <router-view />
      </div>
    </div>

    <StatusBar class="flex-none" />

    <AllServices />
    <AllModals />
  </div>
</template>

<style>
@import '~@guijs/frontend-ui/styles/tailwind.postcss';
</style>
