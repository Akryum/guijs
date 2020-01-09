<script>
import { ref, watch } from '@vue/composition-api'
const Terminals = () => import(
  /* webpackChunkName: 'Terminals' */
  '../terminal/Terminals.vue'
)

const STORAGE_PANE_SIZE = 'dev.guijs.status-bar.pane-size'

export default {
  components: {
    Terminals,
  },

  setup () {
    // Pange above the status bar
    const openPaneId = ref(null)

    function togglePane (id) {
      if (openPaneId.value === id) {
        openPaneId.value = null
      } else {
        openPaneId.value = id
      }
    }

    // Size of the pane above the status bar
    const paneSize = ref(JSON.parse(localStorage.getItem(STORAGE_PANE_SIZE) || '200'))
    watch(paneSize, value => {
      localStorage.setItem(STORAGE_PANE_SIZE, JSON.stringify(value))
    })

    return {
      openPaneId,
      togglePane,
      paneSize,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch bg-white">
    <!-- Pane -->
    <div
      v-if="openPaneId"
      class="border-gray-200 border-t"
      :style="{
        height: `${paneSize}px`,
      }"
    >
      <Terminals
        v-if="openPaneId === 'terminals'"
        class="h-full"
      />
    </div>

    <!-- Status bar -->
    <div class="flex-none flex items-center h-6 bg-gray-200 px-6">
      <!-- Start elements -->
      <div class="flex-1 items-center h-full">
        <!-- TODO -->
      </div>

      <!-- End elements -->
      <VButton
        v-tooltip="$t('guijs.status-bar.toggle-terminals')"
        icon-left="laptop"
        class="h-full px-2 text-gray-600 hover:bg-gray-300"
        @click="togglePane('terminals')"
      />
    </div>
  </div>
</template>
