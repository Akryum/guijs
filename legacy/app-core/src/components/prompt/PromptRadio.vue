<template>
  <VueDisable
    :disabled="!prompt.enabled"
    class="prompt-radio"
  >
    <div class="prompt-content">
      <ListItemInfo
        :name="$t(prompt.message)"
        :description="$t(prompt.description)"
        :link="prompt.link"
      />

      <PromptRadioItem
        v-for="(choice, index) of prompt.choices"
        :key="index"
        :choice="choice"
        :selected="value(choice.value) === radioValue"
        @select="answer(value(choice.value))"
      />
    </div>

    <PromptError :error="prompt.error" />
  </VueDisable>
</template>

<script>
import Prompt from './Prompt'

export default {
  extends: Prompt,

  computed: {
    radioValue () {
      return this.value(this.prompt.value)
    },
  },
}
</script>

<style lang="stylus" scoped>
.list-item-info
  margin-bottom ($padding-item / 2)
</style>
