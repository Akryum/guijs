<template>
  <div class="project-create-step-prompts">
    <Prompts
      :prompts="step.prompts"
      @answer="answerPrompt"
    />
  </div>
</template>

<script>
import Prompts from '@/mixins/Prompts'
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'

export default {
  mixins: [
    Prompts({
      field: 'step',
      query: gql`
        query projectCreationWizard {
          wizard: projectCreationWizard {
            ...projectCreationWizard
          }
        }
        ${projectCreationWizard}
      `,
      variables: {},
      updateQuery (data, prompts) {
        const result = {}
        for (const prompt of prompts) {
          const list = result[prompt.tabId] || (result[prompt.tabId] = [])
          list.push(prompt)
        }
        for (const tabId in result) {
          data.wizard.steps.find(t => t.id === tabId).prompts = result[tabId]
        }
      },
    }),
  ],

  props: {
    step: {
      type: Object,
      required: true,
    },
  },

  watch: {
    configurationValid: {
      async handler (value) {
        await this.$nextTick()
        this.$emit('valid', value)
      },
      immediate: true,
    },
  },
}
</script>
