<template>
  <VueTab
    :id="step.id"
    :label="$t(step.name || 'org.vue.views.project-create.tabs.details.title')"
    :icon="step.id === 'general' ? 'subject' : step.icon"
    :disabled="isTabDisabled"
    :lazy="indexInTabs > 0"
  >
    <div class="step-content content vue-ui-disable-scroll">
      <div v-if="step.description" class="vue-ui-text info banner">
        <VueIcon icon="info" class="big"/>
        <span>{{ $t(step.description) }}</span>
      </div>

      <component
        v-if="currentTabId === step.id"
        :is="`step-${step.type}`"
        :step="step"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>

    <div class="actions-bar">
      <VueButton
        v-if="indexInTabs !== 0"
        icon-left="arrow_back"
        :label="$t('org.vue.views.project-create.tabs.presets.buttons.previous')"
        class="big previous"
        @click="previous()"
      />

      <VueButton
        v-else
        icon-left="close"
        :label="$t('org.vue.views.project-create.tabs.details.buttons.cancel')"
        class="big close"
        @click="cancel()"
      />

      <VueButton
        v-if="step.canSkip"
        :label="$t('org.vue.common.skip')"
        class="big next"
        @click="next()"
      />

      <VueButton
        v-if="hasNext"
        :label="$t('org.vue.views.project-create.tabs.details.buttons.next')"
        :disabled="!isValid"
        icon-right="arrow_forward"
        class="big primary next"
        @click="next()"
      />

      <VueButton
        v-else
        :label="$t('org.vue.views.project-create.tabs.presets.buttons.create')"
        :disabled="!isValid"
        icon-left="done"
        class="big primary next"
        @click="next()"
      />
    </div>
  </VueTab>
</template>

<script>
import ProjectCreateStepGeneral from './ProjectCreateStepGeneral.vue'
import ProjectCreateStepPrompts from './ProjectCreateStepPrompts.vue'
import ProjectCreateStepSelect from './ProjectCreateStepSelect.vue'
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'
import { isTabStep } from './helpers'
import Step from './Step'

export default {
  inheritAttrs: false,

  components: {
    'step-general': ProjectCreateStepGeneral,
    'step-prompts': ProjectCreateStepPrompts,
    'step-select': ProjectCreateStepSelect,
  },

  mixins: [
    Step(),
  ],

  props: {
    currentTabId: {
      type: String,
      required: true,
    },
  },

  apollo: {
    wizard: {
      query: gql`
        query projectCreationWizard {
          wizard: projectCreationWizard {
            ...projectCreationWizard
          }
        }
        ${projectCreationWizard}
      `,
      fetchPolicy: 'cache-only',
    },
  },

  computed: {
    tabSteps () {
      return this.wizard.steps.filter(step => isTabStep(step))
    },

    indexInTabs () {
      return this.tabSteps.indexOf(this.step)
    },

    currentTabIndex () {
      return this.tabSteps.findIndex(t => t.id === this.currentTabId)
    },

    isTabDisabled () {
      return !this.step.enabled || (this.currentTabIndex === this.indexInTabs - 1 && !this.validSteps[this.currentTabId])
    },
  },
}
</script>
