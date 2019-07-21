<template>
  <Widget
    :widget="widget"
    :shell-style="{
      left: `${dashboard.left + 8}px`,
      top: `${dashboard.top + 8}px`,
      width: `${dashboard.width}px`,
      height: `${dashboard.height}px`,
      transformOrigin: `${shellOrigin.x}px ${shellOrigin.y}px`
    }"
    class="widget-details-view"
    details
    @close="close()"
  />
</template>

<script>
export default {
  inject: [
    'dashboard',
  ],

  props: {
    widget: {
      type: Object,
      required: true,
    },

    shellOrigin: {
      type: Object,
      required: true,
    },
  },

  methods: {
    close () {
      this.$emit('close')
    },
  },
}
</script>

<style lang="stylus" scoped>
.widget-details-view
  /deep/ .shell
    position fixed
    z-index 50
</style>
