<script>
import { computed } from 'vue'
import dargs from 'dargs'

export default {
  props: {
    chunk: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const args = computed(() => {
      const rawArgs = dargs({
        ...props.chunk.args,
        _: [],
      })
      return rawArgs.map(raw => {
        const splitted = raw.split('=')
        return {
          name: splitted[0],
          value: splitted.slice(1).join('='),
        }
      })
    })

    return {
      args,
    }
  },
}
</script>

<template>
  <span>
    <span
      v-for="(arg, index) of args"
      :key="index"
      class="inline-flex mr-2"
    >
      <span class="text-teal-500">
        {{ arg.name }}
      </span>

      <template v-if="arg.value">
        <span class="text-gray-500">
          =
        </span>

        <span class="text-purple-500">
          {{ arg.value }}
        </span>
      </template>
    </span>
  </span>
</template>
