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

    label: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: null,
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
  <div
    class="cursor-text"
    @click="focus()"
  >
    <VLabel
      v-if="label"
      class="mb-1"
    >
      {{ $t(label) }}
    </VLabel>

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
        :placeholder="$t(placeholder)"
        :value="value"
        class="flex-1 h-full bg-transparent"
        @input="$emit('update', $event.currentTarget.value)"
      >

      <slot name="after" />
    </div>
  </div>
</template>
