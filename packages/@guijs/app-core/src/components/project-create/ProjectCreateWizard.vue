<template>
  <div class="project-create-wizard page">
    <div v-if="wizard" class="content">
      <StepWizard
        :tab-id.sync="tabId"
        :title="$t('org.vue.views.project-create.title', { type: wizard.type.name })"
        class="frame"
      >
        <template #default="{ next, previous, hasNext, hasPrevious }">
          <ProjectCreateStepTab
            v-for="step of tabSteps"
            :key="step.id"
            :step="step"
            :valid-steps="validSteps"
            :current-tab-id="tabId"
            :has-next="hasNext"
            :has-previous="hasPrevious"
            :folder.sync="folder"
            @next="next()"
            @previous="previous()"
            @cancel="showCancel = true"
            @valid="value => onStepValid(step, value)"
            @remote-preset="value => remotePreset = value"
            @refetch="refetch()"
          />
        </template>
      </StepWizard>
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

      <div slot="footer" class="actions end">
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
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'
import ProjectCreateStepTab from './ProjectCreateStepTab.vue'
import { isTabStep } from './helpers'

const STORAGE_FOLDER = 'project-create-wizard.folder'

export default {
  components: {
    ProjectCreateStepTab,
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
      validSteps: {},
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
  margin-bottom $padding-item

.step-content
  grid-area content
  max-width 800px
  width 100%
  margin auto
</style>
