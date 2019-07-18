<template>
  <VueDisable
    :disabled="!prompt.enabled"
    class="prompt prompt-input"
  >
    <div class="prompt-content">
      <ListItemInfo
        :name="$t(prompt.message)"
        :description="$t(prompt.description)"
        :link="prompt.link"
      />

      <div class="prompt-input">
        <VueInput
          :value="inputValue"
          :type="prompt.type === 'password' ? 'password' : 'text'"
          @update="value => answer(value)"
        />
      </div>
    </div>

    <PromptError
      v-if="displayError"
      :error="prompt.error"
    />
  </VueDisable>
</template>

<script>
import Prompt from './Prompt'

export default {
  extends: Prompt,

  buffer: true,

  data () {
    return {
      displayError: false,
    }
  },

  computed: {
    inputValue () {
      return this.value(this.prompt.value)
    },
  },

  watch: {
    inputValue (value) {
      clearTimeout(this.$_timer)
      if (value != null) {
        this.$_timer = setTimeout(() => {
          this.displayError = true
        }, 500)
      } else {
        this.displayError = false
      }
    },
  },
}
</script>
