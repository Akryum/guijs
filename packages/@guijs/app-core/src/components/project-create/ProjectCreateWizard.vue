<template>
  <div class="project-create-wizard page">
    <div v-if="wizard" class="content">
      <StepWizard
        :tab-id.sync="tabId"
        :title="$t('org.vue.views.project-create.title', { type: wizard.type.name })"
        class="frame"
      >
        <template #default="{ next, previous, hasNext, hasPrevious }">
          <VueTab
            v-for="(step, index) of tabSteps"
            :key="step.id"
            :id="step.id"
            :label="$t(step.name || 'org.vue.views.project-create.tabs.details.title')"
            :icon="step.id === 'general' ? 'subject' : step.icon"
            :disabled="!step.enabled || (tabSteps.findIndex(t => t.id === tabId) === index - 1 && !isStepValid)"
          >
            <div class="step-content content vue-ui-disable-scroll">
              <div v-if="step.description" class="vue-ui-text info banner">
                <VueIcon icon="info" class="huge"/>
                <span>{{ $t(step.description) }}</span>
              </div>

              <component
                :is="`step-${step.type}`"
                :step="step"
                :folder.sync="folder"
                @valid="value => isStepValid = value"
              />
            </div>

            <div class="actions-bar">
              <VueButton
                v-if="index === 0"
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
                @click="showCancel = true"
              />

              <VueButton
                :label="$t('org.vue.views.project-create.tabs.details.buttons.next')"
                :disabled="!isStepValid || !hasNext"
                icon-right="arrow_forward"
                class="big primary next"
                @click="next()"
              />
            </div>
          </VueTab>
        </template>
      </StepWizard>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'
import ProjectCreateStepGeneral from './ProjectCreateStepGeneral.vue'
import ProjectCreateStepPrompts from './ProjectCreateStepPrompts.vue'
import ProjectCreateStepSelect from './ProjectCreateStepSelect.vue'

const TAB_TYPES = [
  'general',
  'prompts',
  'select',
]
const STORAGE_FOLDER = 'project-create-wizard.folder'

export default {
  components: {
    'step-general': ProjectCreateStepGeneral,
    'step-prompts': ProjectCreateStepPrompts,
    'step-select': ProjectCreateStepSelect,
  },

  metaInfo () {
    return {
      title: this.$t('org.vue.views.project-create.title', {
        type: this.wizard ? this.wizard.type.name : '',
      }),
    }
  },

  data () {
    return {
      tabId: 'general',
      showCancel: false,
      folder: '',
      isStepValid: false,
    }
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
      fetchPolicy: 'network-only',
      result ({ data }) {
        if (!data.wizard) {
          this.$router.replace({
            name: 'project-select',
            query: {
              tab: 'create',
            },
          })
        }
      },
    },
  },

  computed: {
    tabSteps () {
      return this.wizard.steps.filter(step => TAB_TYPES.includes(step.type))
    },
  },

  watch: {
    folder (value) {
      sessionStorage.setItem(STORAGE_FOLDER, value)
    },
  },

  created () {
    const folder = sessionStorage.getItem(STORAGE_FOLDER)
    if (folder != null) {
      this.folder = folder
    }
  },

  beforeRouteLeave (from, to, next) {
    this.cancel()
    next()
  },

  methods: {
    async cancel () {
      await this.$apollo.mutate({
        mutation: gql`
          mutation projectCancelCreation {
            projectCancelCreation
          }
        `,
      })
    },

    async createProject () {
      // @TODO
      sessionStorage.removeItem(STORAGE_FOLDER)
    },
  },
}
</script>

<style lang="stylus" scoped>
.project-create-wizard
  display grid
  grid-template-columns 1fr
  grid-template-rows auto
  grid-template-areas "content"

  >>> .tab-button.disabled
    opacity .5

.vue-ui-text.banner
  margin-bottom 6px

.step-content
  grid-area content
  max-width 800px
  width 100%
  margin auto
</style>
