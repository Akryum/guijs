<script>
import Error from './Error.vue'

export default {
  components: {
    Error,
  },

  props: {
    payload: { // ${foundVersion}|${requiredVersion}
      type: String,
      required: true,
    },
  },

  computed: {
    requiredVersion () {
      return this.payload.split('|')[1]
    },
    foundVersion () {
      return this.payload.split('|')[0]
    },
  },
}
</script>

<template>
  <Error
    :label="`Node.js v${requiredVersion} or more is required, found v${foundVersion}`"
  >
    Please update Node at <a
      href="https://nodejs.org"
      target="_blank"
    >nodejs.org</a>
  </Error>
</template>
