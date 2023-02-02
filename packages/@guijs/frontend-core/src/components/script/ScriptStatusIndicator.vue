<script>
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed } from 'vue'

const statusIcons = import.meta.globEager('@/assets/script-*.svg')

export default {
  props: {
    scriptId: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result } = useQuery(gql`
      query scriptStatus ($scriptId: ID!) {
        script (id: $scriptId) {
          id
          status
        }
      }
    `, props)
    const status = computed(() => result.value?.script.status ?? 'idle')

    const icon = computed(() => statusIcons[`/src/assets/script-${status.value}.svg`]?.default)

    return {
      status,
      icon,
    }
  },
}
</script>

<!-- Text styles used to workaround issue in webkit -->

<template>
  <div
    class="w-6 h-6 flex items-center justify-center relative"
    :class="`status-${status}`"
  >
    <div
      v-if="status !== 'success' && status !== 'error'"
      key="dot"
      class="dot-wrapper absolute z-10"
    >
      <div
        class="dot rounded-full"
        :class="{
          'w-3 h-3 border-gray-500 text-gray-500': status === 'idle' || status === 'killed',
          'w-5 h-5 border-teal-400 dark:border-teal-600 text-teal-400 dark:text-teal-600': status === 'running',
        }"
      />
    </div>

    <img
      v-if="icon"
      :src="icon"
      class="icon"
    >

    <transition duration="150">
      <div
        v-if="icon"
        key="icon-bg z-10"
        class="icon-bg absolute"
      >
        <div class="animation w-5 h-5 rounded-full" />
      </div>
    </transition>
  </div>
</template>

<style lang="postcss" scoped>
.dot {
  transition: width .15s, height .15s, border-width .15s;

  .status-idle &,
  .status-killed & {
    border-width: 6px;
  }

  .status-running & {
    border-width: 4px;
  }
}

.icon {
  animation: icon-in 0s .15s backwards;
}

@keyframes icon-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes icon-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.icon-bg {
  animation: icon-out .15s .15s forwards;

  .animation {
    transition: border .15s;
    border-width: 10px;
    @apply border-teal-500 text-teal-500;
  }

  .status-success & .animation {
    @apply border-green-500 text-green-500;
  }

  .status-error & .animation {
    @apply border-red-500 text-red-500;
  }

  &.v-leave-active {
    animation: none;
  }

  &.v-enter,
  &.v-leave-to {
    .animation {
      border-width: 4px;
    }
  }
}
</style>
