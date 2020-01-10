<script>
import { computed } from '@vue/composition-api'
import { ICONS } from './icons'
export default {
  props: {
    command: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      default: false,
    },
  },

  setup (props) {
    const icon = computed(() => {
      if (props.command.icon) return props.command.icon
      return ICONS[props.command.type]
    })

    return {
      icon,
    }
  },
}
</script>

<template>
  <VButton
    class="px-6 py-4"
    :class="{
      'bg-primary-100': selected,
    }"
    align="left"
    square
    @click="$emit('select')"
  >
    <i class="material-icons mr-4 text-gray-500 text-2xl">
      {{ icon }}
    </i>

    <div class="flex-1 text-left">
      <span>{{ command.label }}</span>
      <span
        v-if="command.description && $t(command.description) !== command.label"
        class="text-gray-500 ml-4"
      >
        {{ $t(command.description) }}
      </span>
    </div>

    <div v-if="command.keybinding">
      <VKeybinding
        v-for="seq of command.keybinding.sequences"
        :key="seq"
        :sequence="seq"
        class="ml-2"
      />
    </div>
  </VButton>
</template>
