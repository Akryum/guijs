<template>
  <div class="project-create-step-general">
    <VueFormField
      v-if="cwd"
      :title="$t('org.vue.views.project-create.tabs.details.form.folder.label')"
    >
      <VueInput
        v-model="folderModel"
        :placeholder="$t('org.vue.views.project-create.tabs.details.form.folder.placeholder')"
        icon-left="folder"
        class="big app-name"
      />

      <div slot="subtitle">
        <div class="project-path">
          <div class="path">
            <span
              class="cwd"
              v-tooltip="cwd"
            >
              {{ cwd | folder(42 - folder.length) }}
            </span>
            <span class="folder">{{ folder }}</span>
          </div>

          <VueButton
            icon-left="edit"
            class="change-folder"
            @click="showChangeFodler = true"
          >
            {{ $t('org.vue.views.project-create.tabs.details.form.folder.tooltip') }}
          </VueButton>
        </div>

        <div
          v-if="folder && !folderNameValid"
          class="vue-ui-text danger banner"
        >
          <VueIcon icon="error" class="big"/>
          <span>{{ $t('org.vue.views.project-create.tabs.details.form.folder.folder-name-invalid') }}</span>
        </div>

        <ApolloQuery
          v-if="folder"
          :query="require('@/graphql/folder/folderExists.gql')"
          :variables="{
            file: `${cwd}/${folder}`
          }"
          fetch-policy="no-cache"
          #default="{ result: { data } }"
        >
          <div
            v-if="data && data.folderExists"
            class="vue-ui-text warning banner"
          >
            <VueIcon icon="warning" class="big"/>
            <span>{{ $t('org.vue.views.project-create.tabs.details.form.folder.folder-exists') }}</span>
          </div>
        </ApolloQuery>
      </div>
    </VueFormField>

    <ProjectCreateStepPrompts
      :step="step"
      @valid="value => arePromptsValid = value"
    />

    <FolderExplorerModal
      v-if="showChangeFodler"
      @close="showChangeFodler = false"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { isValidName } from '../../util/folders'

export default {
  props: {
    step: {
      type: Object,
      required: true,
    },

    folder: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      arePromptsValid: false,
      showChangeFodler: false,
    }
  },

  apollo: {
    cwd: {
      query: gql`
        query cwd {
          cwd
        }
      `,
      fetchPolicy: 'network-only',
    },
  },

  computed: {
    folderModel: {
      get () {
        return this.folder
      },
      set (value) {
        this.$emit('update:folder', value)
      },
    },

    folderNameValid () {
      return this.folder && isValidName(this.folder)
    },

    isStepValid () {
      return this.arePromptsValid && this.folderNameValid
    },
  },

  watch: {
    isStepValid: {
      async handler (value) {
        await this.$nextTick()
        this.$emit('valid', value)
      },
      immediate: true,
    },
  },
}
</script>

<style lang="stylus" scoped>
.vue-ui-form-field
  padding $padding-item

.project-path
  h-box()
  box-center()

  .path
    flex 100% 1 1
    margin-right 6px
    h-box()
    align-items baseline

    .folder
      font-weight bold

.vue-ui-text.banner
  margin-top 6px
</style>
