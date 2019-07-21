<template>
  <div class="project-create-wizard page">
    <div
      v-if="wizard"
      class="content"
    >
      <StepWizard
        :tab-id.sync="tabId"
        :title="$t('org.vue.views.project-create.title', { type: wizard.type.name })"
        class="frame"
      >
        <ProjectCreateStepTab
          v-for="step of tabSteps"
          :key="step.id"
          :step="step"
          :valid-steps="validSteps"
          :current-tab-id="tabId"
          :has-next="!!getFirstEnabledStepAfter(step.id)"
          :has-previous="!!getLastEnabledStepBefore(step.id)"
          :folder.sync="folder"
          @next="next()"
          @previous="previous()"
          @cancel="showCancel = true"
          @valid="value => onStepValid(step, value)"
          @remote-preset="value => remotePreset = value"
          @refetch="refetch()"
        />
      </StepWizard>

      <ProjectCreateStepModal
        v-if="currentModalStep"
        :key="currentModalStep.id"
        :step="currentModalStep"
        :valid-steps="validSteps"
        :has-next="!!getFirstEnabledStepAfter(currentModalStep.id)"
        :has-previous="!!getLastEnabledStepBefore(currentModalStep.id)"
        @next="next()"
        @previous="previous()"
        @cancel="showCancel = true"
        @valid="value => onStepValid(currentModalStep, value)"
        @remote-preset="value => remotePreset = value"
        @refetch="refetch()"
      />
    </div>

    <VueModal
      v-if="showCancel"
      :title="$t('org.vue.views.project-create.tabs.details.modal.title')"
      class="small"
      @close="showCancel = false"
    >
      <div class="default-body">
        {{ $t('org.vue.views.project-create.tabs.details.modal.body') }}
      </div>

      <div
        slot="footer"
        class="actions end"
      >
        <VueButton
          :label="$t('org.vue.views.project-create.tabs.details.modal.buttons.back')"
          class="flat"
          @click="showCancel = false"
        />

        <VueButton
          :to="{ name: 'project-select' }"
          :label="$t('org.vue.views.project-create.tabs.details.modal.buttons.clear')"
          icon-left="delete_forever"
          class="danger"
        />
      </div>
    </VueModal>

    <ProgressScreen
      progress-id="project-create"
      :debug="debug"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'
import { isTabStep, isModalStep } from './helpers'
import ProjectCreateStepTab from './ProjectCreateStepTab.vue'
import ProjectCreateStepModal from './ProjectCreateStepModal.vue'

const STORAGE_FOLDER = 'project-create-wizard.folder'

export default {
  components: {
    ProjectCreateStepTab,
    ProjectCreateStepModal,
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
      currentStepId: 'general',
      showCancel: false,
      validSteps: {},
      debug: '',
      // Additional data
      folder: '',
      remotePreset: null,
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
      return this.wizard.steps.filter(step => isTabStep(step))
    },

    currentStep () {
      return this.getStep(this.currentStepId)
    },

    currentModalStep () {
      if (isModalStep(this.currentStep)) {
        return this.currentStep
      }
      return null
    },

    tabId: {
      get () {
        if (isTabStep(this.currentStep)) {
          return this.currentStepId
        }
        return this.getLastTabBefore(this.currentStepId).id
      },
      set (value) {
        if (value !== this.tabId) {
          this.currentStepId = value
        }
      },
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
    onStepValid (step, isValid) {
      this.$set(this.validSteps, step.id, isValid)
    },

    next () {
      const nextStep = this.getFirstEnabledStepAfter(this.currentStepId)
      if (nextStep) {
        this.currentStepId = nextStep.id
      } else {
        this.createProject()
      }
    },

    previous () {
      this.currentStepId = this.getLastEnabledStepBefore(this.currentStepId).id
    },

    getStep (id) {
      if (!this.wizard) {
        return { id: 'general' }
      }
      return this.wizard.steps.find(step => step.id === id)
    },

    getLastTabBefore (stepId) {
      const step = this.getStep(stepId)
      for (let i = this.wizard.steps.indexOf(step) - 1; i > 0; i--) {
        const s = this.wizard.steps[i]
        if (s && s.enabled && isTabStep(s)) {
          return s
        }
      }
    },

    getLastEnabledStepBefore (stepId) {
      const step = this.getStep(stepId)
      for (let i = this.wizard.steps.indexOf(step) - 1; i >= 0; i--) {
        const s = this.wizard.steps[i]
        if (s && s.enabled) {
          return s
        }
      }
    },

    getFirstEnabledStepAfter (stepId) {
      const step = this.getStep(stepId)
      for (let i = this.wizard.steps.indexOf(step) + 1; i < this.wizard.steps.length; i++) {
        const s = this.wizard.steps[i]
        if (s && s.enabled) {
          return s
        }
      }
    },

    async refetch () {
      await this.$apollo.queries.wizard.refetch()
    },

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
      this.debug = ''
      try {
        await this.$apollo.mutate({
          mutation: gql`
            mutation projectCreate ($input: ProjectCreateInput!) {
              projectCreate (input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              folder: this.folder,
              remotePreset: this.remotePreset,
            },
          },
        })
        sessionStorage.removeItem(STORAGE_FOLDER)
        this.$router.push({ name: 'project-home' })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.debug = `ERROR: ${e}`
      }
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

  >>> .vue-ui-text.banner
    margin-bottom $padding-item

  >>> .step-content
    grid-area content
    max-width 800px
    width 100%
    margin auto
</style>
