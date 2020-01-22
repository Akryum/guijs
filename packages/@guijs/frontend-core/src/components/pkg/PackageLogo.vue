<script>
import { ref, watch } from '@vue/composition-api'
import genericLogo from '@/assets/package.png'

export default {
  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    const src = ref(null)

    watch(() => props.pkg.id, async id => {
      src.value = null
      await tryLogo(id, 'logo.svg')
      await tryLogo(id, 'logo.png')
    })

    function tryLogo (id, filename) {
      return new Promise(resolve => {
        const checkId = () => id === props.pkg.id

        if (!checkId()) {
          return resolve(false)
        }

        const img = new Image()
        img.onload = () => {
          if (!checkId()) {
            resolve(false)
          } else {
            src.value = img.src
          }
        }
        img.onerror = () => {
          resolve(false)
        }
        img.src = `https://unpkg.com/${props.pkg.id}/${filename}`
      })
    }

    function onError () {
      src.value = genericLogo
    }

    return {
      src,
      genericLogo,
      onError,
    }
  },
}
</script>

<template>
  <div class="flex items-center justify-center">
    <img
      :src="src || pkg.defaultLogo || genericLogo"
      :alt="`${pkg.id} logo`"
      class="max-w-full max-h-full rounded overflow-hidden"
      @error="onError()"
    >
  </div>
</template>
