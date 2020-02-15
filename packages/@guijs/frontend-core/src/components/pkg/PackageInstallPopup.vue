<script>
export default {
  props: {
    projectTypeSlug: {
      type: String,
      default: null,
    },
  },

  setup (props) {
    const src = `${process.env.VUE_APP_AWESOME_URL}/`
    if (props.projectTypeSlug) {
      src.value += `for/${props.projectTypeSlug}`
    }

    const [, domain] = /^https?:\/\/(\w+(:\d+)?)/.exec(src)
    const secure = src.startsWith('https://')

    return {
      src,
      domain,
      secure,
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
      :src="src"
      frameborder="0"
      class="w-full h-full"
    />
  </div>
</template>
