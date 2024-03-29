<template>
  <div
    class="step-wizard"
    :class="{
      'hide-tabs': hideTabs
    }"
  >
    <div class="shell">
      <div class="header">
        <div class="content">
          <div
            v-if="title"
            class="title"
          >
            {{ title }}
          </div>
        </div>
      </div>

      <VueTabs
        ref="tabs"
        class="main-tabs"
        group-class="accent"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <slot
          :next="next"
          :has-next="hasNext"
          :previous="previous"
          :has-previous="hasPrevious"
        />
      </VueTabs>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    hideTabs: {
      type: Boolean,
      default: false,
    },

    title: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      hasNext: false,
      hasPrevious: false,
    }
  },

  mounted () {
    this.$watch(() => this.hasNextEnabledTab(), value => {
      this.hasNext = value
    }, {
      immediate: true,
    })
    this.$watch(() => this.hasPreviousEnabledTab(), value => {
      this.hasPrevious = value
    }, {
      immediate: true,
    })
  },

  methods: {
    getNextEnabledTabIndex () {
      const tabs = this.$refs.tabs
      for (let i = tabs.activeChildIndex + 1; i < tabs.children.length; i++) {
        if (!tabs.children[i].disabled) {
          return i
        }
      }
      return tabs.activeChildIndex
    },

    hasNextEnabledTab () {
      return this.getNextEnabledTabIndex() !== this.$refs.tabs.activeChildIndex
    },

    next () {
      const tabs = this.$refs.tabs
      tabs.activateChild(this.getNextEnabledTabIndex())
    },

    getPreviousEnabledTabIndex () {
      const tabs = this.$refs.tabs
      for (let i = tabs.activeChildIndex - 1; i >= 0; i--) {
        if (!tabs.children[i].disabled) {
          return i
        }
      }
      return tabs.activeChildIndex
    },

    hasPreviousEnabledTab () {
      return this.getPreviousEnabledTabIndex() !== this.$refs.tabs.activeChildIndex
    },

    previous () {
      const tabs = this.$refs.tabs
      tabs.activateChild(this.getPreviousEnabledTabIndex())
    },
  },
}
</script>

<style lang="stylus" scoped>
.step-wizard
  box-sizing border-box

  .shell
    v-box()
    height 100%

  .header
    .content
      margin 0 auto

  .main-tabs
    height 0
    flex auto 1 1

  >>> .vue-ui-tab
    margin 0 auto
    padding $padding-item $padding-item 0
    box-sizing border-box

  .header,
  >>> .tabs
    background $content-bg-primary-light
    .vue-ui-dark-mode &
      background $content-bg-primary-dark

  >>> .tabs-content
    height 0
    flex auto 1 1

  &,
  >>> .vue-ui-tab,
  >>> .vue-ui-tab-content
    height 100%

  >>> .vue-ui-tab-content
    overflow-y hidden
    v-box()
    margin 0 auto

    > .content
      flex 100% 1 1
      height 0
      overflow-y auto

    > .actions-bar
      justify-content center
      .vue-ui-button:not(.icon-button)
        min-width 190px

  .title
    padding $padding-item
    font-size 24px
    text-align center
    font-weight 300

  &.hide-tabs
    >>> .tabs
      display none

  &.frame
    margin 0 auto
    $max-width = 1200px
    .shell
      background $md-white
      .vue-ui-dark-mode &
        background $vue-ui-color-darker
    .header .content,
    >>> .vue-ui-tab
      max-width $max-width

</style>
