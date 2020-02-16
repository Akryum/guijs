<script>
import { gql } from '@apollo/client/core'
import { useScriptQuery } from './useScript'
const ScriptEditForm = () => import(
  /* webpackChunkName: 'ScriptEditForm' */
  './ScriptEditForm.vue'
)

export default {
  components: {
    ScriptEditForm,
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
    keyScope="edit-script"
    command="edit-script"
    shellClass="max-w-256"
  >
    <template #title>
      <div class="pl-6 pr-3 flex h-full items-center">
        <div class="text-gray-500 text-xl flex items-baseline flex-1">
          <div>
            {{ $t('guijs.edit-script.edit-script') }}
          </div>

          <div class="font-mono ml-2 border border-gray-200 dark:border-gray-950 rounded px-2">
            {{ script.name }}
          </div>
        </div>

        <portal-target
          name="edit-script-actions"
          class="flex-none flex items-stretch"
        />
      </div>
    </template>

    <template #default="{ close }">
      <ScriptEditForm
        @close="close()"
      />
    </template>
  </BaseModal>
</template>
