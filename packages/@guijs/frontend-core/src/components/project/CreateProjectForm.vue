<script>
import { ref } from 'vue'
import FileInput from '../form/FileInput.vue'
import ProjectGeneratorSelect from './ProjectGeneratorSelect.vue'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { taskFragment } from '../task/fragments'
import { useTask } from '../task/useTask'
import { pathDelimiter } from '@/util/env'

export default {
  components: {
    FileInput,
    ProjectGeneratorSelect,
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    const monorepo = ref(null)
    const name = ref('')
    const baseFolder = ref('')
    const projectGeneratorId = ref(null)

    // Submit

    const taskId = ref()

    const { mutate, loading: mutating } = useMutation(gql`
      mutation createProject ($input: CreateProjectInput!) {
        task: createProject (input: $input) {
          ...task
        }
      }
      ${taskFragment}
    `)

    async function submit () {
      const { data } = await mutate({
        input: {
          monorepo: monorepo.value,
          name: name.value,
          baseFolder: baseFolder.value,
          simpleProject: monorepo.value
            ? null
            : {
                projectGeneratorId: projectGeneratorId.value,
              },
        },
      })

      if (data.task) {
        taskId.value = data.task.id
      } else {
        close()
      }
    }

    // Task

    const { running, onSuccess } = useTask(taskId)

    onSuccess(() => {
      close()
    })

    return {
      monorepo,
      name,
      baseFolder,
      projectGeneratorId,
      submit,
      mutating,
      running,
      pathDelimiter,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <VButton
      align="left"
      class="form-input w-full"
      :class="{
        'text-primary-500 bg-primary-100 dark:text-primary-300 dark:bg-primary-900': monorepo === false,
      }"
      @click="monorepo = false"
    >
      <img
        src="@/assets/folder.png"
        alt="Folder icon"
        class="w-10 h-10 mr-6"
      >
      <div class="text-left">
        <div>{{ $t('guijs.create-project.simple-project') }}</div>
        <div class="text-gray-500 whitespace-normal">
          {{ $t('guijs.create-project.simple-project-description') }}
        </div>
      </div>
    </VButton>

    <VButton
      align="left"
      class="form-input w-full mt-6"
      :class="{
        'text-primary-500 bg-primary-100 dark:text-primary-300 dark:bg-primary-900': monorepo,
      }"
      @click="monorepo = true"
    >
      <img
        src="@/assets/folder-tree.png"
        alt="Folder icon"
        class="w-10 h-10 mr-6"
      >
      <div class="text-left">
        <div>{{ $t('guijs.create-project.mono-repo') }}</div>
        <div class="text-gray-500 whitespace-normal">
          {{ $t('guijs.create-project.mono-repo-description') }}
        </div>
      </div>
    </VButton>

    <template v-if="monorepo != null">
      <hr class="my-6 border-gray-200 dark:border-gray-950">

      <FileInput
        v-model="baseFolder"
        directory
      />

      <VInput
        v-model="name"
        label="guijs.create-project.input-name-label"
        placeholder="guijs.create-project.input-name-placeholder"
        class="form-input mt-6"
      />

      <div class="border border-gray-200 dark:border-gray-950 rounded px-6 py-4 mt-6">
        {{ baseFolder }}{{ pathDelimiter }}<b class="text-primary-500">{{ name }}</b>
      </div>

      <ProjectGeneratorSelect
        v-if="!monorepo"
        v-model="projectGeneratorId"
        buttonClass="form-input"
        label="guijs.create-project.input-generator-label"
        placeholder="guijs.create-project.input-generator-placeholder"
        class="mt-6"
      />

      <!-- Actions -->
      <div class="flex mt-6">
        <VButton
          :disabled="!baseFolder || !name || (!monorepo && !projectGeneratorId)"
          :loading="mutating || running"
          iconLeft="done"
          class="flex-1 btn-lg btn-primary"
          @click="submit()"
        >
          {{ $t('guijs.common.proceed') }}
        </VButton>
      </div>
    </template>
  </div>
</template>
