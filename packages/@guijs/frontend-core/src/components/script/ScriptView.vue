<script>
import { bindScope } from '@/util/keybinding'
import ScriptToolbar from './ScriptToolbar.vue'
import ScriptOutput from './ScriptOutput.vue'

export default {
  components: {
    ScriptToolbar,
    ScriptOutput,
  },

  setup () {
    bindScope('script-view')

    return {}
  },
}
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <ScriptToolbar class="flex-none" />

    <div class="flex-auto h-0 mx-6 mb-6">
      <ScriptOutput class="h-full" />
    </div>
  </div>
</template>
