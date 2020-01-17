<template>
  <VueDisable
    :disabled="!prompt.enabled"
    class="prompt prompt-buttongroup"
  >
    <div class="prompt-content">
      <ListItemInfo
        :name="$t(prompt.message)"
        :description="$t(prompt.description)"
        :link="prompt.link"
      />

      <div class="prompt-input">
        <VueGroup
          :value="value(prompt.value)"
          @update="value => answer(value)"
        >
          <VueGroupButton
            v-for="(choice, index) of prompt.choices"
            :key="index"
            :value="value(choice.value)"
          >
            {{ $t(choice.name) }}
          </VueGroupButton>
        </VueGroup>
      </div>
    </div>

    <PromptError :error="prompt.error" />
  </VueDisable>
</template>

<script>
import Prompt from './Prompt'

export default {
  extends: Prompt,
}
</script>
