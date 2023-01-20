<script>
import { ref, watch, computed } from 'vue'
import { proxy } from '@/util/proxy'
import UnknownProjectTypeLogo from '@/assets/box.svg'

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

    const url = computed(() => {
      const logo = props.projectType.logo
      if (props.projectType.id.startsWith('__')) return logo
      return proxy(logo)
    })

    watch(error, value => {
      if (value) {
        const img = new Image()
        img.src = url.value
        img.onload = () => {
          error.value = false
        }
      }
    })

    return {
      error,
      loaded,
      url,
    }
  },
}
</script>

<template>
  <img
    :key="projectType.logo"
    :src="error ? UnknownProjectTypeLogo : url"
    :class="{
      'bg-gray-200 dark:bg-gray-950 rounded text-transparent': !loaded,
    }"
    alt="Logo"
    @error="error = true"
    @load="loaded = true"
  >
</template>
