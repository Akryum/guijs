<script>
import { ref, watch, onMounted } from '@vue/composition-api'
export default {
  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    // eslint-disable-next-line vue/require-prop-types
    value: {
      required: true,
    },

    icon: {
      type: String,
      default: null,
    },

    autoFocus: {
      type: Boolean,
      default: false,
    },
  },

  setup (props) {
    const input = ref()

    function focus () {
      if (input.value) {
        input.value.focus()
      } else {
        const unwatch = watch(input, () => {
          unwatch()
          focus()
        })
      }
    }

    onMounted(() => {
      if (props.autoFocus) {
        focus()
      }
    })

    return {
      input,
      focus,
    }
  },
}
</script>

<template>
  <div>
    <div class="flex items-center h-full">
      <slot name="before" />

      <i
        v-if="icon"
        class="material-icons flex-none text-gray-500 text-lg mr-4"
      >
        {{ icon }}
      </i>

      <input
        ref="input"
        v-bind="$attrs"
        :value="value"
        class="flex-1 h-full"
        @input="$emit('update', $event.currentTarget.value)"
      >

      <slot name="after" />
    </div>
  </div>
</template>
