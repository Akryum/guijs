<script>
import Progress from './Progress.vue'

export default {
  components: {
    Progress,
  },

  data () {
    return {
      progress: 0,
    }
  },
}
</script>

<template>
  <Progress
    :progress="progress"
    label="Downloading packages..."
  />
</template>
