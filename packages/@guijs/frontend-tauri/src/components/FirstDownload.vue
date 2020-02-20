<script>
import Progress from './Progress.vue'

export default {
  components: {
    Progress,
  },

  data () {
    return {
      progress: -1,
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
