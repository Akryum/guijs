<script>
import { useScriptRun } from './useScript'
import ScriptStatusIndicator from './ScriptStatusIndicator.vue'

export default {
  components: {
    ScriptStatusIndicator,
  },

  props: {
    script: {
      type: Object,
      required: true,
    },
  },

  setup () {
    const { runScript } = useScriptRun()

    return {
      runScript,
    }
  },
}
</script>

<template>
  <VButton
    :to="{
      name: 'project-script',
      params: {
        ...$route.params,
        scriptId: script.id,
      }
    }"
    align="left"
    square
    extend
    class="btn-md hover:bg-primary-100 dark:hover:bg-primary-900"
    :class="{
      active: $route.params.scriptId === script.id,
    }"
    @dblclick.native="runScript(script.id)"
  >
    <ScriptStatusIndicator
      :scriptId="script.id"
      class="mr-4"
    />
    <div class="flex-1 text-left w-0 truncate">
      {{ script.name }}
    </div>
  </VButton>
</template>
