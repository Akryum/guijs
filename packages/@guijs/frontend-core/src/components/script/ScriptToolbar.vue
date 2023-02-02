<script>
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import { onKeybind } from '@/util/keybinding'
import { useScriptQuery, useScriptRun } from './useScript'
import Keybindings from '../keybinding/Keybindings.vue'
import { runCommand } from '../../util/command'

export default {
  components: {
    Keybindings,
  },

  setup () {
    const { script } = useScriptQuery(gql`
      query script ($scriptId: ID!) {
        script (id: $scriptId) {
          ...script
        }
      }
      ${scriptFragment}
    `)

    // Actions

    const { runScript, stopScript } = useScriptRun()

    function editScript () {
      runCommand('edit-script')
    }

    // Keybinding

    onKeybind('toggle-run-current-script', () => {
      if (script.value.status === 'running') {
        stopScript(script.value.id)
      } else {
        runScript(script.value.id)
      }
    })

    return {
      script,
      runScript,
      stopScript,
      editScript,
    }
  },
}
</script>

<template>
  <div
    v-if="script"
    class="flex items-center p-6"
  >
    <!-- Actions -->
    <VTooltip
      placement="bottom"
    >
      <VButton
        v-if="script.status !== 'running'"
        iconLeft="play_arrow"
        class="btn-md btn-primary"
        @click="runScript(script.id)"
      >
        {{ $t('guijs.script.run-script') }}
      </VButton>
      <VButton
        v-else
        iconLeft="stop"
        class="btn-md btn-primary"
        @click="stopScript(script.id)"
      >
        {{ $t('guijs.script.stop-script') }}
      </VButton>

      <template #popper>
        <div class="flex">
          <span class="mr-2">
            {{ $t(script.status !== 'running' ? 'guijs.script.run-script' : 'guijs.script.stop-script') }}
          </span>

          <Keybindings keybindingId="toggle-run-current-script" />
        </div>
      </template>
    </VTooltip>

    <VButton
      v-tooltip="$t('guijs.script.edit-script')"
      iconLeft="edit"
      class="p-3 btn-dim ml-4"
      @click="editScript()"
    />

    <!-- Views -->
    <div class="flex-1 flex items-center justify-end">
      <!-- @TODO ButtonGroup -->
      <VButton
        iconLeft="dvr"
        class="btn-md btn-dim"
      >
        {{ $t('guijs.script.output') }}
      </VButton>
    </div>
  </div>
</template>
