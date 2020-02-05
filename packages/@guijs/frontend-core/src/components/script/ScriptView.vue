<script>
import ScriptToolbar from './ScriptToolbar.vue'
import ScriptOutput from './ScriptOutput.vue'

export default {
  components: {
    ScriptToolbar,
    ScriptOutput,
  },

  setup () {
    return {}
  },
}
</script>

<template>
  <div class="flex flex-col h-full">
    <ScriptToolbar class="flex-none" />

    <div class="flex-1 mx-6 mb-6">
      <ScriptOutput class="h-full" />
    </div>
  </div>
</template>
