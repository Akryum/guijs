<script>
import { ref, watch } from '@vue/composition-api'

export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const error = ref(false)
    const loaded = ref(false)

    watch(() => props.projectType, () => {
      error.value = false
      loaded.value = false
    })

    watch(error, value => {
      if (value) {
        const img = new Image()
        img.src = props.projectType.logo
        img.onload = () => {
          error.value = false
        }
      }
    })

    return {
      error,
      loaded,
    }
  },
}
</script>

<template>
  <img
    :key="projectType.logo"
    :src="error ? require('@/assets/box.svg') : projectType.logo"
    :class="{
      'bg-gray-200 dark:bg-gray-950 rounded': !loaded,
    }"
    alt="Logo"
    @error="error = true"
    @load="loaded = true"
  >
</template>
