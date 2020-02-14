<script>
import Error from './Error.vue'

export default {
  components: {
    Error,
  },

  data () {
    return {
      requiredVersion: '12',
      currentVersion: '10.0.0',
    }
  },
}
</script>

<template>
  <Error
    :label="`Node.js v${requiredVersion} or more is required, found v${currentVersion}`"
  >
    Please update Node at <a
      href="https://nodejs.org"
      target="_blank"
    >nodejs.org</a>
  </Error>
</template>
