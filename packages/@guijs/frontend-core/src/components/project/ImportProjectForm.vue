<script>
import { watch, reactive } from '@vue/composition-api'
import FileInput from '../form/FileInput.vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  components: {
    FileInput,
  },

  setup (props, { emit }) {
    const formData = reactive({
      path: '',
      name: '',
      bookmarked: false,
    })

    const { mutate: check, error: checkError } = useMutation(gql`
      mutation checkImportProject ($path: String!) {
        checkImportProject (path: $path) {
          packageName
        }
      }
    `, () => ({
      variables: {
        path: formData.path,
      },
    }))

    watch(() => formData.path, async value => {
      if (value) {
        const { data } = await check()
        // Autofill name
        if (!formData.name) {
          formData.name = data.checkImportProject.packageName
        }
      }
    })

    // Import

    const {
      mutate: importProject,
      loading: importing,
      error: importError,
      onDone,
    } = useMutation(gql`
      mutation importProject ($input: ImportProjectInput!) {
        importProject (input: $input) {
          id
        }
      }
    `, () => ({
      variables: {
        input: {
          ...formData,
        },
      },
    }))

    onDone((result) => {
      emit('close')
      // @TODO go to project
    })

    return {
      formData,
      checkError,
      importProject,
      importing,
      importError,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <FileInput
      v-model="formData.path"
      directory
    />

    <template v-if="formData.path">
      <VInput
        v-model="formData.name"
        label="guijs.import-project.input-name-label"
        placeholder="guijs.import-project.input-name-placeholder"
        class="form-input my-6"
      />

      <VSwitch
        v-model="formData.bookmarked"
        :icon="formData.bookmarked ? 'bookmark' : 'bookmark_border'"
        label="guijs.import-project.input-bookmarked-label"
        class="form-input my-6"
      />
    </template>

    <VError :error="checkError || importError" />

    <div
      v-if="formData.path"
      class="flex mt-6"
    >
      <VButton
        :loading="importing"
        iconLeft="unarchive"
        class="flex-1 btn-lg btn-primary"
        @click="importProject()"
      >
        {{ $t('guijs.import-project.import-button') }}
      </VButton>
    </div>
  </div>
</template>
