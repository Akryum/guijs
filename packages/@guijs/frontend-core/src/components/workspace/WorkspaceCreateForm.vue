<script>
import { ref } from '@vue/composition-api'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { taskFragment } from '../task/fragments'
import { useTask } from '../task/useTask'
import ProjectGeneratorSelect from '../project/ProjectGeneratorSelect.vue'

export default {
  components: {
    ProjectGeneratorSelect,
  },

  setup (props, { emit }) {
    function close () {
      emit('close')
    }

    const name = ref('')
    const projectGeneratorId = ref(null)

    // Submit

    const taskId = ref()

    const { mutate, loading: mutating } = useMutation(gql`
      mutation createProjectWorkspace ($input: CreateProjectWorkspaceInput!) {
        task: createProjectWorkspace (input: $input) {
          ...task
        }
      }
      ${taskFragment}
    `)

    async function submit () {
      const { data } = await mutate({
        input: {
          name: name.value,
          projectGeneratorId: projectGeneratorId.value,
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
      name,
      projectGeneratorId,
      submit,
      mutating,
      running,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <VInput
      v-model="name"
      label="guijs.create-workspace.input-name-label"
      placeholder="guijs.create-workspace.input-name-placeholder"
      class="form-input"
    />

    <ProjectGeneratorSelect
      v-model="projectGeneratorId"
      buttonClass="form-input"
      label="guijs.create-workspace.input-generator-label"
      placeholder="guijs.create-workspace.input-generator-placeholder"
      class="mt-6"
    />

    <!-- Actions -->
    <div class="flex mt-6">
      <VButton
        :disabled="!name || !projectGeneratorId"
        :loading="mutating || running"
        iconLeft="done"
        class="flex-1 btn-lg btn-primary"
        @click="submit()"
      >
        {{ $t('guijs.common.proceed') }}
      </VButton>
    </div>
  </div>
</template>
