<script>
export default {
  props: {
    packageName: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <div>
    Hello {{ packageName }}
  </div>
</template>
