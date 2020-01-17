<template>
  <VueModal
    v-bind="$attrs"
    :title="$t('org.vue.components.folder-explorer.modal.title')"
    class="large"
    v-on="$listeners"
  >
    <FolderExplorer />

    <div
      slot="footer"
      class="actions"
    >
      <VueButton
        :label="$t('org.vue.components.folder-explorer.modal.action')"
        class="primary big"
        @click="$emit('close')"
      />
    </div>
  </VueModal>
</template>

<script>
export default {
  inheritAttrs: false,
}
</script>

<style lang="stylus" scoped>
.folder-explorer
  height 70vh
  padding 0 24px

  >>> .toolbar
    padding-top 0
</style>
