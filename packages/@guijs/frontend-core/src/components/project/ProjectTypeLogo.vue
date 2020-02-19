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

    watch(() => props.projectType, () => {
      error.value = false
    })

    return {
      error,
    }
  },
}
</script>

<template>
  <img
    :src="error ? require('@/assets/box.svg') : projectType.logo"
    alt="Logo"
    @error="error = true"
  >
</template>
