<template>
  <VueModal
    :title="$t('org.vue.components.project-type-modal.title')"
    class="medium"
    @close="$emit('close')"
  >
    <div class="default-body">
      <VueLoadingIndicator
        v-if="$apollo.loading"
        class="big accent"
      />

      <div
        v-else
        class="types"
      >
        <ProjectTypeItem
          v-for="projectType of projectTypes"
          :key="projectType.id"
          :project-type="projectType"
          @select="createProject(projectType.id)"
        />
      </div>
    </div>

    <div
      slot="footer"
      class="actions"
    >
      <VueButton
        :label="$t('org.vue.common.cancel')"
        class="flat big"
        @click="$emit('close')"
      />
    </div>
  </VueModal>
</template>

<script>
import gql from 'graphql-tag'
import ProjectTypeItem from './ProjectTypeItem.vue'
import { projectCreationWizard } from './fragments'

export default {
  components: {
    ProjectTypeItem,
  },

  apollo: {
    projectTypes: gql`
      query {
        projectTypes {
          id
          name
          logo
          description
          link
        }
      }
    `,
  },

  methods: {
    async createProject (type) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation projectInitCreation ($input: ProjectInitCreationInput!) {
            projectInitCreation (input: $input) {
              ...projectCreationWizard
            }
          }
          ${projectCreationWizard}
        `,
        variables: {
          input: {
            type,
          },
        },
      })

      this.$router.push({ name: 'project-create' })
    },
  },
}
</script>

<style lang="stylus" scoped>
.types
  display grid
  grid-gap $padding-item
  grid-template-columns repeat(2, 1fr)
</style>
