<template>
  <VueButton
    class="project-type-item big"
    @click="$emit('select')"
  >
    <div class="content">
      <ItemLogo
        :image="projectType.logo"
        fallback-icon="account_balance_wallet"
      />

      <div class="name">
        {{ projectType.name }}
      </div>
    </div>
  </VueButton>
</template>

<script>
export default {
  props: {
    projectType: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.project-type-item.vue-ui-button
  padding $padding-item
  height 64px
  >>> .default-slot
    width 100%

.content
  display flex
  align-items center
  width 100%

.item-logo
  margin-right $padding-item
</style>
