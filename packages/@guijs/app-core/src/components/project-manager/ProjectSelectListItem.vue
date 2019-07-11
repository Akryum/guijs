<template>
  <div class="project-select-list-item list-item">
    <div
      ref="content"
      class="content"
      @click="onContentClick"
    >
      <div class="project-type pointer-events-none">
        <ItemLogo
          :image="project.type.logo"
          fallback-icon="folder"
        />
      </div>

      <div class="info">
        <ListItemInfo
          :description="project.path"
        >
          <div slot="name" class="name">
            <span>{{ project.name }}</span>

            <ProjectTasksDropdown
              class="bullet-menu"
              :project="project"
            />
          </div>
        </ListItemInfo>
      </div>

      <div class="actions">
        <VueButton
          class="icon-button flat"
          :icon-left="project.favorite ? 'star' : 'star_border'"
          v-tooltip="$t('org.vue.components.project-select-list-item.tooltips.favorite')"
          data-testid="favorite-button"
          @click.stop="$emit('favorite')"
        />

        <VueDropdown>
          <template #trigger>
            <VueButton
              icon-left="more_vert"
              class="icon-button flat"
            />
          </template>

          <VueDropdownButton
            icon-left="open_in_browser"
            @click.stop="openInEditor()"
          >
            {{ $t('org.vue.components.project-select-list-item.tooltips.open-in-editor') }}
          </VueDropdownButton>

          <VueDropdownButton
            v-if="project.homepage"
            :href="project.homepage"
            target="_blank"
            icon-left="open_in_new"
            @click.stop
          >
            {{ $t('org.vue.components.top-bar.homepage') }}
          </VueDropdownButton>

          <VueDropdownButton
            icon-left="edit"
            @click.stop="showRename = true"
          >
            {{ $t('org.vue.components.project-rename.title') }}
          </VueDropdownButton>

          <VueDropdownButton
            icon-left="close"
            data-testid="delete-button"
            @click.stop="$emit('remove')"
          >
            {{ $t('org.vue.components.project-select-list-item.tooltips.delete') }}
          </VueDropdownButton>
        </VueDropdown>
      </div>
    </div>

    <ProjectRename
      v-if="showRename"
      :project="project"
      @close="showRename = false"
    />
  </div>
</template>

<script>
import OPEN_IN_EDITOR from '@/graphql/file/fileOpenInEditor.gql'

import ProjectRename from './ProjectRename.vue'

export default {
  components: {
    ProjectRename,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      showRename: false,
    }
  },

  methods: {
    onContentClick (e) {
      if (e.target === this.$refs.content) {
        this.$emit('open')
      }
    },

    async openInEditor () {
      await this.$apollo.mutate({
        mutation: OPEN_IN_EDITOR,
        variables: {
          input: {
            file: this.project.path,
          },
        },
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.content
  padding $padding-item
  display grid
  grid-template-columns auto 1fr auto
  grid-template-rows auto
  grid-template-areas "icon info actions"

.project-type
  grid-area icon
  h-box()
  box-center()

.info
  grid-area info

.actions
  grid-area actions
  h-box()
  align-items center

  >>> > *
    space-between-x($padding-item)

.name
  h-box()
  align-items center

.bullet-menu
  margin-left 6px

.project-select-list-item
  &.open
    &:not(:hover)
      background rgba($vue-ui-color-primary, .05)
</style>
