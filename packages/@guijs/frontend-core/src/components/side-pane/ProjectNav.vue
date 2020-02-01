<script>
import { runCommand, onCommand } from '@/util/command'
import { useRouter } from '@/util/router'
import CommandKeybinding from '../command/CommandKeybinding.vue'
import Keybindings from '../keybinding/Keybindings.vue'

export default {
  components: {
    CommandKeybinding,
    Keybindings,
  },

  setup () {
    const router = useRouter()

    onCommand('show-packages', () => {
      router.push({
        name: 'project-packages',
        params: {
          ...router.currentRoute.params,
        },
      })
    })

    onCommand('show-scripts', () => {
      router.push({
        name: 'project-scripts',
        params: {
          ...router.currentRoute.params,
        },
      })
    })

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
      class="flex-none btn-md hover:bg-primary-100 dark-hover:bg-primary-900"
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

    <VTooltip
      placement="right"
      class="flex-none"
    >
      <VButton
        :to="{
          name: 'project-packages',
          params: {
            ...$route.params,
          },
        }"
        :class="{
          active: $route.fullPath.includes('/packages/'),
        }"
        iconLeft="extension"
        class="btn-md w-full hover:bg-primary-100 dark-hover:bg-primary-900 leading-normal"
        square
        align="left"
      >
        {{ $t('guijs.side-pane.packages') }}
      </VButton>

      <template #popper>
        <div class="flex">
          <div class="mr-2">
            {{ $t('guijs.package.show-packages') }}
          </div>
          <Keybindings keybindingId="show-packages" />
        </div>
      </template>
    </VTooltip>

    <VTooltip
      placement="right"
      class="flex-none"
    >
      <VButton
        :to="{
          name: 'project-scripts',
          params: {
            ...$route.params,
          },
        }"
        :class="{
          active: $route.fullPath.includes('/scripts/'),
        }"
        iconLeft="assignment"
        class="btn-md w-full hover:bg-primary-100 dark-hover:bg-primary-900 leading-normal"
        square
        align="left"
      >
        {{ $t('guijs.side-pane.scripts') }}
      </VButton>

      <template #popper>
        <div class="flex">
          <div class="mr-2">
            {{ $t('guijs.script.show-scripts') }}
          </div>
          <Keybindings keybindingId="show-scripts" />
        </div>
      </template>
    </VTooltip>
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
