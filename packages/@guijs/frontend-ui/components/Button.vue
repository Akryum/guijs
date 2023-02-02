<script>
import SubmitAnimation from './SubmitAnimation.vue'
import { computed } from 'vue'

export default {
  components: {
    SubmitAnimation,
    CustomRouterLink: {
      functional: true,
      render (h, { data, children, listeners }) {
        if (listeners['!click']) {
          data.nativeOn = data.nativeOn || {}
          data.nativeOn['!click'] = listeners['!click']
        }
        return h('router-link', data, children)
      },
    },
  },

  inheritAttrs: false,

  props: {
    iconLeft: {
      type: String,
      default: null,
    },

    iconRight: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      default: 'button',
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    align: {
      type: String,
      default: 'center',
    },

    square: {
      type: Boolean,
      default: false,
    },

    extend: {
      type: Boolean,
      default: false,
    },

    stop: {
      type: Boolean,
      default: false,
    },
  },

  setup (props, { attrs, emit }) {
    const component = computed(() => {
      if (attrs.to) {
        return 'CustomRouterLink'
      } else if (attrs.href) {
        return 'a'
      } else {
        return 'button'
      }
    })

    const ghost = computed(() => props.disabled || props.loading)

    function handleClick (event) {
      if (ghost.value) {
        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
      } else {
        if (props.stop) {
          event.stopPropagation()
          event.stopImmediatePropagation()
        }
        emit('click', event)
      }
    }

    return {
      component,
      ghost,
      handleClick,
    }
  },
}
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    :type="type"
    :tabindex="ghost ? -1 : 0"
    role="button"
    :aria-disabled="ghost"
    class="btn inline-block cursor-pointer relative select-none outline-none group"
    :class="{
      'pointer-events-none opacity-75': ghost,
      'text-center': align === 'center',
      'rounded': !square,
    }"
    @click="handleClick"
  >
    <div
      class="flex items-center w-full truncate"
      :class="{
        'opacity-0': loading,
        'opacity-50': !loading && ghost,
        'justify-center': align === 'center',
      }"
    >
      <i
        v-if="iconLeft"
        class="material-icons flex-none text-lg"
        :class="{
          'mr-2 opacity-75 group-hover:opacity-100': $slots.default,
        }"
      >{{ iconLeft }}</i>

      <slot name="content">
        <div
          class="flex items-center"
          :class="{
            'flex-1': extend,
          }"
        >
          <slot />
        </div>
      </slot>

      <i
        v-if="iconRight"
        class="material-icons flex-none text-lg"
        :class="{
          'ml-2 opacity-75 group-hover:opacity-100': $slots.default,
        }"
      >{{ iconRight }}</i>
    </div>

    <SubmitAnimation
      v-if="loading"
      class="absolute inset-0"
    />
  </component>
</template>

<style lang="postcss">
.btn {
  &:not(.form-input) {
    &:focus,
    &:focus-within {
      &.focus-visible::after {
        content: '';
        @apply block absolute inset-0 border border-primary-500 rounded pointer-events-none;
      }

      &.btn-primary::after {
        @apply border-black;

        .mode-dark & {
          @apply border-white;
        }
      }
    }
  }
}

.btn-primary {
  @apply text-white bg-primary-500;

  &:hover {
    @apply bg-primary-400;
  }
}

.btn-secondary {
  @apply text-white bg-secondary-500;

  &:hover {
    @apply bg-secondary-400;
  }
}

.btn-tertiary {
  @apply text-white bg-tertiary-500;

  &:hover {
    @apply bg-tertiary-400;
  }
}

.btn-dim {
  @apply bg-gray-200;

  &:hover {
    @apply bg-gray-300;
  }

  .mode-dark & {
    @apply bg-gray-800;

    &:hover {
      @apply bg-gray-700;
    }
  }
}

.btn-flat {
  @apply text-gray-600;

  &:hover {
    @apply text-gray-900 bg-gray-300;
  }

  .mode-dark & {
    @apply text-gray-400;

    &:hover {
      @apply text-gray-100 bg-gray-700;
    }
  }
}

.btn-sm {
  @apply px-2 py-2;
}

.btn-md {
  @apply px-5 py-3;
}

.btn-lg {
  @apply px-6 py-4 leading-none;
}
</style>
