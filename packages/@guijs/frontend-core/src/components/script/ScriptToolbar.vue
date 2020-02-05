<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import { terminalFragment } from '../terminal/fragments'

export default {
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

    // Run

    const { mutate: run } = useMutation(gql`
      mutation runScript ($input: RunScriptInput!) {
        runScript (input: $input) {
          ...script
          terminal {
            ...terminal
          }
        }
      }
      ${scriptFragment}
      ${terminalFragment}
    `)

    // Stop

    const { mutate: stop } = useMutation(gql`
      mutation stopScript ($input: StopScriptInput!) {
        stopScript (input: $input) {
          ...script
        }
      }
      ${scriptFragment}
    `)

    return {
      script,
      run,
      stop,
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
    <VButton
      v-if="script.status !== 'running'"
      iconLeft="play_arrow"
      class="btn-lg btn-primary"
      @click="run({ input: { scriptId: script.id } })"
    >
      {{ $t('guijs.script.run-script') }}
    </VButton>
    <VButton
      v-else
      iconLeft="stop"
      class="btn-lg btn-primary"
      @click="stop({ input: { scriptId: script.id } })"
    >
      {{ $t('guijs.script.stop-script') }}
    </VButton>

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
