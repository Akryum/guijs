<script>
import { ref, watch, computed } from '@vue/composition-api'
import { onDrag } from '@guijs/frontend-ui/util/drag'
import { onCommand, runCommand } from '@/util/command'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { commandWithKeybindingFragment } from '../command/fragments'
const Terminals = () => import(
  /* webpackChunkName: 'Terminals' */
  '../terminal/Terminals.vue'
)

const STORAGE_PANE_SIZE = 'dev.guijs.status-bar.pane-size'

export default {
  setup () {
    const panes = [
      {
        id: 'terminals',
        icon: 'laptop',
        tooltip: 'guijs.status-bar.toggle-terminals',
        component: Terminals,
      },
    ]

    const openPaneId = ref(null)

    const currentPane = computed(() => panes.find(p => p.id === openPaneId.value))

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

    // Shortcuts

    const shortcutsQuery = useQuery(gql`
      query commandShortcuts {
        commandShortcuts {
          ...command
        }
      }
      ${commandWithKeybindingFragment}
    `)
    const commandShortcuts = useResult(shortcutsQuery.result, [])

    // Commands
    onCommand('toggle-terminals', () => {
      togglePane('terminals')
    })
    onCommand('new-terminal', () => {
      openPaneId.value = 'terminals'
    })

    return {
      panes,
      currentPane,
      openPaneId,
      togglePane,
      paneDisplaySize,
      resizeHandle,
      commandShortcuts,
      runCommand,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-stretch bg-white">
    <!-- Pane -->
    <div
      v-if="currentPane"
      class="relative border-gray-400 border-t dark:bg-gray-850 dark:border-gray-750 flex-none"
      :style="{
        height: `${paneDisplaySize}px`,
      }"
    >
      <!-- Resize handle -->
      <div
        ref="resizeHandle"
        class="resize-handle absolute left-0 right-0 z-10 cursor-ns-resize group flex items-center"
      >
        <div class="resize-handle-border w-full bg-primary-200 dark:bg-primary-900 invisible group-hover:visible" />
      </div>

      <component
        :is="currentPane.component"
        class="h-full"
      />
    </div>

    <!-- Status bar -->
    <div
      class="flex-none flex items-center h-6 px-6"
      :class="{
        'bg-gray-200 dark:bg-gray-950': !currentPane,
        'bg-white dark:bg-gray-850': currentPane,
      }"
    >
      <!-- Start elements -->
      <div class="flex-1 items-center h-full">
        <!-- Pane buttons -->
        <VButton
          v-for="pane of panes"
          :key="pane.id"
          v-tooltip="$t(pane.tooltip)"
          :iconLeft="pane.icon"
          class="h-full px-2 text-gray-600 hover:bg-gray-300 dark-hover:bg-gray-800"
          :class="{
            'text-primary-500': openPaneId === pane.id,
          }"
          square
          @click="togglePane(pane.id)"
        />
      </div>

      <!-- End elements -->

      <!-- Command shortcuts -->
      <VButton
        v-for="command of commandShortcuts"
        :key="command.id"
        v-tooltip="$t(command.description || command.label)"
        :iconLeft="command.icon"
        class="h-full px-2 text-gray-600 hover:bg-gray-300 dark-hover:bg-gray-800"
        square
        @click="runCommand(command.id)"
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
