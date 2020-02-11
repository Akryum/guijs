<script>
const ImportProjectForm = () => import(
  /* webpackChunkName: 'ImportProjectForm' */
  './ImportProjectForm.vue'
)

export default {
  components: {
    ImportProjectForm,
  },
}
</script>

<template>
  <BaseModal
    v-slot="{ close }"
    keyScope="import-project"
    command="import-project"
    shellClass="max-w-128"
    title="guijs.import-project.import-a-project"
  >
    <ImportProjectForm
      @close="close()"
    />
  </BaseModal>
</template>
