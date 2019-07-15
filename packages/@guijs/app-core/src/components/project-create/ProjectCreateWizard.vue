<template>
  <div class="project-cerate-wizard">
    {{ wizard }}
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { projectCreationWizard } from './fragments'

export default {
  metaInfo () {
    return {
      title: this.$t('org.vue.views.project-create.title'),
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

  beforeDestroy () {
    this.cancel()
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
  },
}
</script>
