<script>
import { useScriptQuery } from './useScript'
import gql from 'graphql-tag'
import { useMutation } from '@vue/apollo-composable'
import { ref, watch } from 'vue'

export default {
  setup (props, { emit }) {
    const { script } = useScriptQuery(gql`
      query script ($scriptId: ID!) {
        script (id: $scriptId) {
          id
          name
        }
      }
    `)

    const formData = ref({})

    watch(script, value => {
      formData.value = {
        name: value.name,
      }
    })

    function close () {
      emit('close')
    }

    // Save

    const { mutate, loading: mutating } = useMutation(gql`
      mutation renameScript ($input: RenameNpmScriptInput!) {
        renameNpmScript (input: $input) {
          id
          name
        }
      }
    `)

    async function save () {
      if (!formData.value.name) return
      await mutate({
        input: {
          scriptId: script.value.id,
          name: formData.value.name,
        },
      })
      close()
    }

    return {
      formData,
      save,
      mutating,
      close,
    }
  },
}
</script>

<template>
  <div
    class="px-6"
    @keyup.enter="save()"
  >
    <VInput
      v-model="formData.name"
      label="guijs.edit-script.input-name-label"
      placeholder="guijs.edit-script.input-name-placeholder"
      class="form-input my-6"
      autoFocus
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
        {{ $t('guijs.edit-script.rename') }}
      </VButton>
    </div>
  </div>
</template>
