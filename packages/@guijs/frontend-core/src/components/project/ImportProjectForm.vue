<script>
import { watch, reactive, ref } from '@vue/composition-api'
import FileInput from '../form/FileInput.vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { runCommand } from '../../util/command'

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

    const validationError = ref(null)

    const {
      mutate,
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

    async function importProject () {
      validationError.value = null

      // Validate input
      if (!formData.name) {
        validationError.value = 'guijs.import-project.error-name-required'
        return
      }

      await mutate()
    }

    onDone(async (result) => {
      emit('close')
      await runCommand('open-project', {
        projectId: result.data.importProject.id,
      })
    })

    return {
      formData,
      checkError,
      validationError,
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

    <VError :error="checkError || validationError || importError" />

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
