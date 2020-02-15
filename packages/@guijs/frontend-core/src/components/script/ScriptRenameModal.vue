<script>
import gql from 'graphql-tag'
import { useScriptQuery } from './useScript'
const ScriptRenameForm = () => import(
  /* webpackChunkName: 'ScriptRenameForm' */
  './ScriptRenameForm.vue'
)

export default {
  components: {
    ScriptRenameForm,
  },

  setup () {
    const { script } = useScriptQuery(gql`
      query script ($scriptId: ID!) {
        script (id: $scriptId) {
          id
          name
        }
      }
    `)

    return {
      script,
    }
  },
}
</script>

<template>
  <BaseModal
    keyScope="rename-script"
    command="rename-script"
    shellClass="max-w-128"
  >
    <template #title>
      <div class="modal-title flex h-full items-center">
        <div class="flex items-baseline">
          <div>
            {{ $t('guijs.edit-script.rename-script') }}
          </div>

          <div class="font-mono ml-2 border border-gray-200 dark:border-gray-950 rounded px-2">
            {{ script.name }}
          </div>
        </div>
      </div>
    </template>

    <template #default="{ close }">
      <ScriptRenameForm
        @close="close()"
      />
    </template>
  </BaseModal>
</template>
