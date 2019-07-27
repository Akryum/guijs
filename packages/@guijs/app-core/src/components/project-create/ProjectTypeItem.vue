<template>
  <VueButton
    class="project-type-item big"
    @click.native="$emit('select')"
  >
    <div class="content">
      <ItemLogo
        :image="projectType.logo"
        fallback-icon="account_balance_wallet"
      />

      <ListItemInfo
        :name="projectType.name"
        :description="projectType.description"
      />

      <VueButton
        v-if="projectType.link"
        v-tooltip="$t('org.vue.components.list-item-info.more-info')"
        :href="projectType.link"
        target="_blank"
        icon-left="open_in_new"
        class="icon-button flat primary big"
        @click.native.stop
      />
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
  text-align left
  /deep/ > .content > .default-slot
    width 100%

.content
  display flex
  align-items center
  width 100%

.item-logo
  margin-right $padding-item

.list-item-info
  flex 1
</style>
