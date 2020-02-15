<script>
import { ref } from '@vue/composition-api'
import { onCommand } from '../../util/command'
export default {
  props: {
    projectTypeSlug: {
      type: String,
      default: null,
    },
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    // Src

    const src = `${process.env.VUE_APP_AWESOME_URL}/`
    if (props.projectTypeSlug) {
      src.value += `for/${props.projectTypeSlug}`
    }

    const [, domain] = /^https?:\/\/(\w+(:\d+)?)/.exec(src)
    const secure = src.startsWith('https://')

    // iframe

    const iframe = ref()

    function onLoad () {
      iframe.value.contentWindow.postMessage({
        awesomeInstallationAvailable: true,
      }, src)
    }

    onCommand('install-package', () => {
      close()
    })

    return {
      src,
      domain,
      secure,
      iframe,
      onLoad,
    }
  },
}
</script>

<template>
  <div class="h-full">
    <portal to="install-package-popup-title">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-500">
        <i class="material-icons text-base mr-2">
          {{ secure ? 'lock' : 'language' }}
        </i>
        {{ domain }}
      </div>
    </portal>

    <iframe
      ref="iframe"
      :src="src"
      frameborder="0"
      class="w-full h-full"
      @load="onLoad()"
    />
  </div>
</template>
