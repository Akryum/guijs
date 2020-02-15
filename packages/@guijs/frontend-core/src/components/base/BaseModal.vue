<script>
import { ref, watch } from '@vue/composition-api'
import { onCommand } from '@/util/command'
import { useGlobalMutationLoading } from '@vue/apollo-composable'

export default {
  inheritAttrs: false,

  props: {
    title: {
      type: String,
      default: null,
    },

    command: {
      type: String,
      default: null,
    },

    open: {
      type: Boolean,
      default: false,
    },

    locked: {
      type: Boolean,
      default: false,
    },
  },

  setup (props, { emit }) {
    const isOpen = ref(false)

    function setOpen (value) {
      isOpen.value = value
      emit('update:open', value)
    }

    watch(() => props.open, value => {
      isOpen.value = value
    })

    const mutating = useGlobalMutationLoading()

    if (props.command) {
      onCommand(props.command, () => {
        setOpen(true)
      })
    }

    return {
      isOpen,
      setOpen,
      mutating,
    }
  },
}
</script>

<template>
  <VModal
    v-if="isOpen"
    v-bind="$attrs"
    :locked="mutating || locked"
    @close="setOpen(false)"
  >
    <template #title>
      <slot name="title">
        <div class="modal-title">
          {{ $t(title) }}
        </div>
      </slot>
    </template>

    <slot :close="() => setOpen(false)" />
  </VModal>
</template>
