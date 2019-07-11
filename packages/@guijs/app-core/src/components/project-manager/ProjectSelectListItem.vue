<template>
  <div
    class="project-select-list-item list-item"
    :class="{
      opening,
    }"
  >
    <div
      ref="content"
      class="content"
      @click="onContentClick"
    >
      <div class="project-type pointer-events-none">
        <ItemLogo
          ref="itemLogo"
          :image="project.type.logo"
          fallback-icon="folder"
          :style="itemLogoStyle"
        />
      </div>

      <div class="info pointer-events-none">
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
          @click="$emit('favorite')"
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
            @click="openInEditor()"
          >
            {{ $t('org.vue.components.project-select-list-item.tooltips.open-in-editor') }}
          </VueDropdownButton>

          <VueDropdownButton
            v-if="project.homepage"
            :href="project.homepage"
            target="_blank"
            icon-left="open_in_new"
          >
            {{ $t('org.vue.components.top-bar.homepage') }}
          </VueDropdownButton>

          <VueDropdownButton
            icon-left="edit"
            @click="showRename = true"
          >
            {{ $t('org.vue.components.project-rename.title') }}
          </VueDropdownButton>

          <VueDropdownButton
            icon-left="close"
            data-testid="delete-button"
            @click="$emit('remove')"
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
      opening: false,
      itemLogoStyle: {
        left: null,
        top: null,
      },
    }
  },

  methods: {
    onContentClick (e) {
      if (e.target === this.$refs.content) {
        this.open()
      }
    },

    async open () {
      const itemLogo = this.$refs.itemLogo.$el
      const bounds = itemLogo.getBoundingClientRect()
      this.itemLogoStyle.left = `${bounds.left}px`
      this.itemLogoStyle.top = `${bounds.top}px`
      this.opening = true
      await this.$nextTick()
      this.$emit('open')
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

.project-type,
.info,
.actions
  h-box()
  align-items center

.project-type
  grid-area icon
  // Prevent size from changing during opening animation
  width 66px
  height 50px

  >>> .item-logo
    border transparent 2px solid
    border-radius 50%
    padding 2px

.info
  grid-area info

.actions
  grid-area actions

  >>> > *
    space-between-x($padding-item)

.name
  h-box()
  align-items center

.bullet-menu
  margin-left 6px
  pointer-events all

.project-select-list-item
  &:active
    background $vue-ui-primary-100

  &.open
    .project-type
      >>> .item-logo
        border-color $vue-ui-primary-200

  &.opening
    // Open animation on project type logo
    .project-type
      >>> .item-logo
        transition transform .3s, opacity .3s
        transform-origin center
        transform scale(4)
        opacity 0
        position fixed
</style>
