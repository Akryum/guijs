<script>
import Error from './Error.vue'

export default {
  components: {
    Error,
  },
}
</script>

<template>
  <Error
    label="Node.js was not found on your system"
  >
    Please install Node and NPM at <a
      href="https://nodejs.org"
      target="_blank"
    >nodejs.org</a>
  </Error>
</template>
