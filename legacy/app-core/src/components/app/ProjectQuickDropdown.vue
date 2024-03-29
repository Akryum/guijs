<template>
  <div class="project-quick-dropdown">
    <VueDropdown
      v-if="$responsive.wide"
      class="current-project"
    >
      <template #trigger>
        <VueButton
          icon-right="arrow_drop_down"
          class="project-label flat"
        >
          <img
            v-if="projectTypeLogo"
            :key="projectTypeLogo"
            :src="projectTypeLogo"
            class="project-type-logo"
          >
          <div
            v-tooltip.right="projectLabelText.length > 16 ? projectLabelText : false"
            class="project-label-text"
          >
            {{ projectLabelText }}
          </div>
        </VueButton>
      </template>

      <!-- Current project options -->

      <template v-if="projectCurrent">
        <VueSwitch
          :value="projectCurrent.favorite"
          :icon="projectCurrent.favorite ? 'star' : 'star_border'"
          class="extend-left"
          @update="toggleCurrentFavorite()"
        >
          {{ $t('org.vue.components.project-select-list-item.tooltips.favorite') }}
        </VueSwitch>

        <VueDropdownButton
          :label="$t('org.vue.components.project-select-list-item.tooltips.open-in-editor')"
          icon-left="open_in_browser"
          @click="openInEditor(projectCurrent)"
        />

        <VueDropdownButton
          :label="$t('org.vue.components.project-rename.title')"
          icon-left="edit"
          @click="showRename = true"
        />

        <VueDropdownButton
          v-if="projectCurrent.homepage"
          :href="projectCurrent.homepage"
          :label="$t('org.vue.components.top-bar.homepage')"
          target="_blank"
          icon-left="open_in_new"
        />
      </template>

      <div class="dropdown-separator" />

      <!-- Favorites -->

      <div
        v-if="!favoriteProjects.length"
        class="vue-ui-empty"
      >
        {{ $t('org.vue.components.top-bar.no-favorites') }}
      </div>

      <template v-else>
        <div class="section-title">
          {{ $t('org.vue.components.top-bar.favorite-projects') }}
        </div>

        <VueDropdownButton
          v-for="project of favoriteProjects"
          :key="project.id"
          :label="project.name"
          icon-left="star"
          @click="openProject(project)"
        />
      </template>

      <!-- Recents -->

      <template v-if="recentProjects.length">
        <div class="dropdown-separator" />

        <div class="section-title">
          {{ $t('org.vue.components.top-bar.recent-projects') }}
        </div>

        <VueDropdownButton
          v-for="project of recentProjects"
          :key="project.id"
          :label="project.name"
          icon-left="restore"
          @click="openProject(project)"
        />
      </template>

      <div class="dropdown-separator" />

      <VueDropdownButton
        :to="{ name: 'project-select' }"
        :label="$t('org.vue.views.project-select.title')"
        icon-left="home"
      />
    </VueDropdown>

    <ProjectRename
      v-if="showRename"
      :project="projectCurrent"
      @close="showRename = false"
    />
  </div>
</template>

<script>
import { resetApollo } from '@/vue-apollo'
import { getImageUrl } from '@/util/image'

import PROJECT_CURRENT from '@/graphql/project/projectCurrent.gql'
import PROJECTS from '@/graphql/project/projects.gql'
import PROJECT_OPEN from '@/graphql/project/projectOpen.gql'
import PROJECT_SET_FAVORITE from '@/graphql/project/projectSetFavorite.gql'
import OPEN_IN_EDITOR from '@/graphql/file/fileOpenInEditor.gql'

import ProjectRename from '../project-manager/ProjectRename.vue'

export default {
  components: {
    ProjectRename,
  },

  apollo: {
    projectCurrent: PROJECT_CURRENT,
    projects: PROJECTS,
  },

  data () {
    return {
      showRename: false,
    }
  },

  computed: {
    favoriteProjects () {
      if (!this.projects) return []
      return this.projects.filter(
        p => p.favorite && (!this.projectCurrent || this.projectCurrent.id !== p.id)
      )
    },

    recentProjects () {
      if (!this.projects) return []
      return this.projects.filter(
        p => !p.favorite && (!this.projectCurrent || this.projectCurrent.id !== p.id)
      ).sort((a, b) => b.openDate - a.openDate).slice(0, 3)
    },

    projectTypeLogo () {
      if (this.projectCurrent && this.projectCurrent.type) {
        return getImageUrl(this.projectCurrent.type.logo)
      }
      return null
    },

    projectLabelText () {
      return this.projectCurrent ? this.projectCurrent.name : this.$t('org.vue.components.status-bar.project.empty')
    },
  },

  methods: {
    async openProject (project) {
      this.$bus('quickOpenProject', project)

      await this.$apollo.mutate({
        mutation: PROJECT_OPEN,
        variables: {
          id: project.id,
        },
      })

      await resetApollo()
    },

    async toggleCurrentFavorite () {
      if (this.projectCurrent) {
        await this.$apollo.mutate({
          mutation: PROJECT_SET_FAVORITE,
          variables: {
            id: this.projectCurrent.id,
            favorite: this.projectCurrent.favorite ? 0 : 1,
          },
        })
      }
    },

    async openInEditor (project) {
      await this.$apollo.mutate({
        mutation: OPEN_IN_EDITOR,
        variables: {
          input: {
            file: project.path,
          },
        },
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.current-project
  width 100%
  >>> .trigger
    .vue-ui-button
      .vue-ui-icon.right
        width 20px
        height @width

  &.v-popper--open
    .project-label
      background $vue-ui-primary-100
      .vue-ui-dark-mode &
        background $vue-ui-gray-800

.vue-ui-empty
  padding 6px

.project-label
  padding $padding-item
  height 64px

  >>> .default-slot
    display flex
    align-items center
    flex 1

.project-label-text
  flex 100% 1 1
  width 0
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  font-size 16px
  padding 2px 0

.project-type-logo
  flex auto 0 0
  width 24px
  height @width
  border-radius 50%
  margin-right 6px
  position relative
  left -2px
  background $vue-ui-gray-100
</style>
