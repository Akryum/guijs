<script>
import { runCommand } from '@/util/command'
import CommandKeybinding from '../command/CommandKeybinding.vue'

export default {
  components: {
    CommandKeybinding,
  },

  setup () {
    return {
      runCommand,
    }
  },
}
</script>

<template>
  <div class="flex flex-col">
    <VButton
      iconLeft="search"
      class="flex-1 btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
      square
      align="left"
      @click="runCommand('find')"
    >
      {{ $t('guijs.side-pane.find') }}

      <CommandKeybinding
        commandId="find"
        class="ml-2"
      />
    </VButton>

    <VButton
      :to="{
        name: 'project-packages',
      }"
      :class="{
        active: $route.fullPath.includes('/packages/'),
      }"
      iconLeft="extension"
      class="flex-1 btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
      square
      align="left"
    >
      {{ $t('guijs.side-pane.packages') }}
    </VButton>
  </div>
</template>

<style lang="postcss" scoped>
.active {
  @apply bg-primary-100;
  .mode-dark & {
    @apply bg-primary-900;
  }
}
</style>
