<template>
  <div class="about page">
    <div class="logo">
      <img
        class="logo-image"
        src="@/assets/guijs.svg"
        alt="guijs logo"
      >
    </div>

    <h1>guijs</h1>

    <p
      class="description"
      v-html="$t('org.vue.views.about.description')"
    />

    <div class="links vue-ui-grid default-gap">
      <VueButton
        href="https://guijs.dev"
        target="_blank"
        class="big"
      >
        Home
      </VueButton>
      <VueButton
        href="https://github.com/Akryum/guijs"
        target="_blank"
        class="big"
      >
        Repository
      </VueButton>
    </div>

    <div class="actions">
      <VueButton
        :to="previousRoute"
        class="primary big"
        left-icon="arrow_back"
        :label="$t('org.vue.views.about.back')"
      />
    </div>
  </div>
</template>

<script>
export default {
  metaInfo () {
    return {
      title: this.$t('org.vue.views.about.title'),
    }
  },

  data () {
    return {
      previousRoute: { name: 'home' },
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from) vm.previousRoute = from.fullPath
    })
  },
}
</script>

<style lang="stylus" scoped>
.about
  padding 42px
  margin 0 auto
  box-sizing border-box
  height 100%
  display flex
  flex-direction column
  align-items center
  justify-content center

  .logo
    width 128px
    height @width

    .logo-image
      width 100%
      height @width

  .description
    margin-top $padding-item

  .links
    margin-top @padding
    grid-template-columns repeat(2, 180px)

  .actions
    margin-top @padding
    h-box()
    box-center()
</style>
