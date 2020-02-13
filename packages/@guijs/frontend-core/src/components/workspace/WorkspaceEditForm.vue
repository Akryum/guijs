<script>
import { useCurrentWorkspace } from './useWorkspace'
import { ref, watch } from '@vue/composition-api'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectWorkspaceFragment } from './fragments'
import { useRoute } from '@/util/router'
import ProjectTypeSelect from '../project/ProjectTypeSelect.vue'

export default {
  components: {
    ProjectTypeSelect,
  },

  setup (props, { emit }) {
    const route = useRoute()
    const { workspace, loading } = useCurrentWorkspace()

    const formData = ref({})

    watch(workspace, value => {
      if (value) {
        formData.value = {
          name: value.name,
          typeId: value.type.id,
        }
      }
    })

    function close () {
      emit('close')
    }

    const { mutate, loading: mutating } = useMutation(gql`
      mutation editProjectWorkspace ($input: EditProjectWorkspaceInput!) {
        editProjectWorkspace (input: $input) {
          ...projectWorkspace
        }
      }
      ${projectWorkspaceFragment}
    `)

    async function save () {
      if (!formData.value.name) return
      await mutate({
        input: {
          projectId: route.value.params.projectId,
          workspaceId: workspace.value.id,
          name: formData.value.name,
          typeId: formData.value.typeId,
        },
      })
      close()
    }

    return {
      workspace,
      loading,
      formData,
      save,
      close,
      mutating,
    }
  },
}
</script>

<template>
  <VEmpty
    v-if="!loading && !workspace"
    icon="error"
    class="py-8"
  >
    {{ $t('guijs.workspace.no-workspace-selected') }}
  </VEmpty>

  <div
    v-else
    class="px-6"
    @keyup.enter="save()"
  >
    <VInput
      v-model="formData.name"
      label="guijs.edit-workspace.input-name-label"
      placeholder="guijs.edit-workspace.input-name-placeholder"
      class="form-input my-6"
      autoFocus
    />

    <ProjectTypeSelect
      v-model="formData.typeId"
      buttonClass="form-input"
      label="guijs.edit-workspace.input-type-label"
      placeholder="guijs.edit-workspace.input-type-placeholder"
      class="my-6"
    />

    <!-- Actions -->
    <div class="flex my-6">
      <VButton
        :disabled="mutating"
        iconLeft="close"
        class="flex-1 btn-lg btn-dim mr-6"
        @click="close()"
      >
        {{ $t('guijs.common.cancel') }}
      </VButton>

      <VButton
        :loading="mutating"
        :disabled="!formData.name"
        iconLeft="save"
        class="flex-1 btn-lg btn-primary"
        @click="save()"
      >
        {{ $t('guijs.common.save') }}
      </VButton>
    </div>
  </div>
</template>
