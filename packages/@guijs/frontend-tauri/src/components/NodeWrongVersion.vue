<script>
import Error from './Error.vue'

export default {
  components: {
    Error,
  },

  props: {
    payload: { // current version
      type: String,
      required: true,
    },
  },

  data () {
    return {
      requiredVersion: '12',
    }
  },
}
</script>

<template>
  <Error
    :label="`Node.js v${requiredVersion} or more is required, found v${payload}`"
  >
    Please update Node at <a
      href="https://nodejs.org"
      target="_blank"
    >nodejs.org</a>
  </Error>
</template>
