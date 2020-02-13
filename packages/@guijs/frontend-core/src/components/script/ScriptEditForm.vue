<script>
import { useScriptQuery } from './useScript'
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { ref, watch } from '@vue/composition-api'
import { runCommand } from '../../util/command'

export default {
  setup () {
    const { script } = useScriptQuery(gql`
      query script ($scriptId: ID!) {
        script (id: $scriptId) {
          id
          command
        }
      }
    `)

    const formData = ref({})

    watch(script, value => {
      formData.value = {
        command: value.command,
      }
    })

    const showRawInput = ref(false)

    // Save

    const { mutate, loading: mutating } = useMutation(gql`
      mutation editScript ($input: EditNpmScriptInput!) {
        editNpmScript (input: $input) {
          id
          command
        }
      }
    `)

    async function save () {
      if (!formData.value.command) return

      showRawInput.value = false

      await mutate({
        input: {
          scriptId: script.value.id,
          command: formData.value.command,
        },
      })
    }

    // Rename

    function renameScript () {
      runCommand('rename-script')
    }

    return {
      formData,
      save,
      mutating,
      showRawInput,
      renameScript,
    }
  },
}
</script>

<template>
  <div>
    <div
      class="px-6 flex items-center border-gray-200 dark:border-gray-950 border-b"
      :class="{
        'py-16': !showRawInput,
        'py-12': showRawInput,
      }"
    >
      <template v-if="!showRawInput">
        <div class="font-mono flex-1">
          {{ formData.command }}
        </div>

        <VButton
          v-tooltip="$t('guijs.edit-script.edit-directly')"
          iconLeft="edit"
          class="p-4 btn-flat mr-6"
          @click="showRawInput = true"
        />
      </template>

      <template v-else>
        <VInput
          v-model="formData.command"
          class="form-input flex-1 font-mono"
          @keyup.native.enter="showRawInput = false"
        >
          <template #after>
            <VButton
              iconLeft="done"
              class="p-4 btn-flat"
              @click="showRawInput = false"
            />
          </template>
        </VInput>
      </template>
    </div>

    <portal to="edit-script-actions">
      <VButton
        :disabled="mutating"
        class="btn-lg min-w-32 btn-dim mr-3"
        @click="renameScript()"
      >
        {{ $t('guijs.edit-script.rename') }}
      </VButton>

      <VButton
        :loading="mutating"
        :disabled="!formData.command"
        iconLeft="save"
        class="btn-lg min-w-32 btn-primary"
        @click="save()"
      >
        {{ $t('guijs.common.save') }}
      </VButton>
    </portal>
  </div>
</template>
