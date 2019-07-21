<template>
  <div class="project-select page">
    <StepWizard
      :tab-id.sync="tab"
      class="frame"
    >
      <VueTab
        id="existing"
        :label="$t('org.vue.views.project-select.tabs.projects')"
        icon="home"
        class="select"
      >
        <ProjectSelectList />
      </VueTab>

      <VueTab
        id="create"
        :label="$t('org.vue.views.project-select.tabs.create')"
        icon="add_box"
        class="create"
        lazy
      >
        <div class="content">
          <FolderExplorer />
        </div>

        <div class="actions-bar center">
          <VueButton
            icon-left="add"
            :label="$t('org.vue.views.project-select.buttons.create')"
            class="big primary create-project"
            @click="selectCreateFolder()"
          />
        </div>
      </VueTab>

      <VueTab
        id="import"
        :label="$t('org.vue.views.project-select.tabs.import')"
        icon="unarchive"
        class="import"
        lazy
      >
        <div class="content">
          <FolderExplorer />
        </div>

        <div class="actions-bar center">
          <VueButton
            icon-left="unarchive"
            :label="$route.query.action || $t('org.vue.views.project-select.buttons.import')"
            class="big primary import-project"
            :disabled="folderCurrent && !folderCurrent.isPackage"
            :loading="busy"
            @click="importProject()"
          />
        </div>
      </VueTab>
    </StepWizard>

    <div class="top-menu left">
      <VueButton
        v-if="projectCurrent"
        :to="{ name: 'home' }"
        class="flat icon-button"
        icon-left="arrow_back"
      />
    </div>

    <div class="top-menu right">
      <VueButton
        v-tooltip="$t('org.vue.views.about.title')"
        :to="{ name: 'about' }"
        class="flat icon-button"
        icon-left="help"
      />
    </div>

    <VueModal
      v-if="showNoModulesModal"
      :title="$t('org.vue.views.project-select.import.no-modules.title')"
      class="small no-modules-modal"
      @close="showNoModulesModal = false"
    >
      <div class="default-body">
        <div class="message">
          {{ $t('org.vue.views.project-select.import.no-modules.message') }}
        </div>
      </div>

      <div
        slot="footer"
        class="actions center"
      >
        <VueButton
          :label="$t('org.vue.views.project-select.import.force')"
          @click="importProject(true)"
        />
        <VueButton
          class="primary"
          :label="$t('org.vue.views.project-select.import.no-modules.close')"
          @click="showNoModulesModal = false"
        />
      </div>
    </VueModal>

    <ProjectTypeModal
      v-if="showProjectTypeModal"
      @close="showProjectTypeModal = false"
    />
  </div>
</template>

<script>
import ProjectTypeModal from '../project-create/ProjectTypeModal.vue'

import FOLDER_CURRENT from '@/graphql/folder/folderCurrent.gql'
import PROJECT_IMPORT from '@/graphql/project/projectImport.gql'
import PROJECT_CURRENT from '@/graphql/project/projectCurrent.gql'
import gql from 'graphql-tag'

export default {
  name: 'ProjectSelect',

  components: {
    ProjectTypeModal,
  },

  metaInfo () {
    return {
      title: this.$t('org.vue.views.project-select.title'),
    }
  },

  data () {
    return {
      folderCurrent: {},
      tab: undefined,
      showNoModulesModal: false,
      showProjectTypeModal: false,
      busy: false,
    }
  },

  apollo: {
    folderCurrent: FOLDER_CURRENT,
    projectCurrent: PROJECT_CURRENT,
    projectCreationWizard: {
      query: gql`
      query {
        projectCreationWizard {
          type {
            id
            name
          }
        }
      }
      `,
      fetchPolicy: 'network-only',
    },
  },

  mounted () {
    // Fix issue with Firefox
    setTimeout(() => {
      this.tab = this.$route.query.tab || 'existing'
    })
  },

  methods: {
    selectCreateFolder () {
      this.showProjectTypeModal = true
    },

    async importProject (force = false) {
      this.showNoModulesModal = false
      this.busy = true
      await this.$nextTick()
      try {
        await this.$apollo.mutate({
          mutation: PROJECT_IMPORT,
          variables: {
            input: {
              path: this.folderCurrent.path,
              force,
            },
          },
        })

        this.$router.push({ name: 'project-home' })
      } catch (e) {
        if (e.graphQLErrors && e.graphQLErrors.some(e => e.message === 'NO_MODULES')) {
          this.showNoModulesModal = true
        }
        this.busy = false
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.folder-explorer
  height 100%

.folder-explorer
  flex 100% 1 1

.project-select
  height 100%

  >>> .tabs
    padding-top $padding-item

.top-menu
  position fixed
  top $padding-item
  &.left
    left $padding-item
  &.right
    right $padding-item
</style>
