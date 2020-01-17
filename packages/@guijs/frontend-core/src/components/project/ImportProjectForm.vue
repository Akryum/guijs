<script>
import { watch, reactive } from '@vue/composition-api'
import FileInput from '../form/FileInput.vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

export default {
  components: {
    FileInput,
  },

  setup () {
    const formData = reactive({
      folder: '',
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
        path: formData.folder,
      },
    }))

    watch(() => formData.folder, async value => {
      if (value) {
        const { data } = await check()
        // Autofill name
        if (!formData.name) {
          formData.name = data.checkImportProject.packageName
        }
      }
    })

    return {
      formData,
      checkError,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <FileInput
      v-model="formData.folder"
      directory
    />

    <template v-if="formData.folder">
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

    <VError :error="checkError" />

    <div
      v-if="formData.folder"
      class="flex mt-6"
    >
      <VButton
        icon-left="unarchive"
        class="flex-1 btn-lg btn-primary"
      >
        {{ $t('guijs.import-project.import-button') }}
      </VButton>
    </div>
  </div>
</template>
