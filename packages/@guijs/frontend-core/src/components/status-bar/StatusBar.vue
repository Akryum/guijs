<script>
import { ref, watch, computed } from '@vue/composition-api'
import { onDrag } from '@guijs/frontend-ui/util/drag'
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

    // Resize

    function getSize (size) {
      return Math.max(100, Math.min(size, window.innerHeight * 0.95))
    }

    const resizeHandle = ref(null)
    const { previewY } = onDrag(resizeHandle, ({ dY }) => {
      paneSize.value = getSize(paneSize.value - dY)
    })

    const paneDisplaySize = computed(() => getSize(paneSize.value - previewY.value))

    return {
      openPaneId,
      togglePane,
      paneDisplaySize,
      resizeHandle,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch bg-white">
    <!-- Pane -->
    <div
      v-if="openPaneId"
      class="relative border-gray-300 border-t"
      :style="{
        height: `${paneDisplaySize}px`,
      }"
    >
      <!-- Resize handle -->
      <div
        ref="resizeHandle"
        class="resize-handle absolute left-0 right-0 z-10 cursor-ns-resize group flex items-center"
      >
        <div class="resize-handle-border w-full bg-primary-200 invisible group-hover:visible" />
      </div>

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
        square
        @click="togglePane('terminals')"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.resize-handle {
  top: -3px;
  height: 5px;
}

.resize-handle-border {
  height: 3px;
}
</style>
