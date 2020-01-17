<template>
  <div
    class="prompt-radio-item prompt"
    :class="{
      selected
    }"
    :data-value="choice.value"
    @click="$emit('select')"
  >
    <div class="content">
      <div
        class="radio-icon"
      >
        <VueIcon
          :icon="selected ? 'radio_button_checked' : 'radio_button_unchecked'"
          class="medium"
        />
      </div>

      <ListItemInfo
        :name="$t(choice.name)"
        :description="$t(choice.description)"
        :selected="selected"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    choice: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.prompt
  padding $padding-item
  padding-left 0

  .content
    display grid
    grid-template-columns 64px auto
    grid-template-rows auto
    grid-template-areas "icon info"

  .radio-icon
    h-box()
    box-center()
    grid-area icon

  .list-item-info
    grid-area info

  &.selected
    .radio-icon
      >>> svg
        fill $vue-ui-color-primary
</style>
