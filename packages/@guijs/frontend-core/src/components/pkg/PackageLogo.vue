<script>
import { ref, watch } from '@vue/composition-api'
import genericLogo from '@/assets/package.png'
import { proxy } from '@/util/proxy'

const cache = {}

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
      if (cache[id] !== undefined) {
        src.value = cache[id]
      } else {
        src.value = null
        await tryLogo(id, 'logo.svg')
        await tryLogo(id, 'logo.png')
      }
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
            src.value = cache[id] = img.src
          }
        }
        img.onerror = () => {
          cache[id] = null
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
      proxy,
    }
  },
}
</script>

<template>
  <div>
    <img
      :src="src || pkg.defaultLogo ? proxy(src || pkg.defaultLogo) : genericLogo"
      :alt="`${pkg.id} logo`"
      class="w-full h-full rounded overflow-hidden text-transparent"
      @error="onError()"
    >
  </div>
</template>
