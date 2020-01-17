<script>
export default {
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

    label: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup (props, { emit }) {
    function toggleValue () {
      emit('update', !props.value)
    }

    return {
      toggleValue,
    }
  },
}
</script>

<template>
  <div
    class="cursor-pointer"
    :tabindex="disabled ? -1 : 0"
    role="checkbox"
    :aria-disabled="disabled"
    :aria-checked="!!value"
    @click="toggleValue"
    @keydown.enter="focused = true; toggleValue($event)"
    @keydown.space="focused = true; toggleValue($event)"
    @blur="focused = false"
  >
    <div class="flex items-center">
      <i
        v-if="icon"
        class="material-icons"
      >
        {{ icon }}
      </i>

      <span class="flex-1">
        <slot />

        <span v-if="label">
          {{ $t(label) }}
        </span>
      </span>

      <!-- Switch visuals -->
      <div
        class="relative bullet-wrapper w-8 h-4 bg-gray-400 dark:bg-gray-950 rounded-full"
        :class="{
          'bg-primary-500 dark:bg-primary-400': value
        }"
      >
        <!-- Bullet -->
        <div class="bullet absolute w-3 h-3 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.bullet-wrapper {
  padding: 2px;
  transition: background .15s ease-out;
}

.bullet {
  left: 2px;
  transition: left .15s ease-out;

  [aria-checked="true"] & {
    left: 18px;
  }
}
</style>
