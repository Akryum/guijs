<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import { onKeybind } from '@/util/keybinding'
import { useScriptRun } from './useScript'
import Keybindings from '../keybinding/Keybindings.vue'

export default {
  components: {
    Keybindings,
  },

  setup () {
    const route = useRoute()

    const { result } = useQuery(gql`
      query script ($id: ID!) {
        script (id: $id) {
          ...script
        }
      }
      ${scriptFragment}
    `, () => ({
      id: route.value.params.scriptId,
    }), () => ({
      enabled: !!route.value.params.scriptId,
    }))
    const script = useResult(result)

    // Actions

    const { runScript, stopScript } = useScriptRun()

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
        class="btn-lg btn-primary"
        @click="runScript(script.id)"
      >
        {{ $t('guijs.script.run-script') }}
      </VButton>
      <VButton
        v-else
        iconLeft="stop"
        class="btn-lg btn-primary"
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
      disabled
      class="p-4 btn-dim ml-4"
    />

    <!-- Views -->
    <div class="flex-1 flex items-center justify-end">
      <!-- @TODO ButtonGroup -->
      <VButton
        iconLeft="dvr"
        class="btn-lg btn-dim"
      >
        {{ $t('guijs.script.output') }}
      </VButton>
    </div>
  </div>
</template>
