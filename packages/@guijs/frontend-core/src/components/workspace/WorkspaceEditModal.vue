<script>
const WorkspaceEditForm = () => import(
  /* webpackChunkName: 'WorkspaceEditForm' */
  './WorkspaceEditForm.vue'
)

export default {
  components: {
    WorkspaceEditForm,
  },
}
</script>

<template>
  <BaseModal
    v-slot="{ close }"
    keyScope="edit-workspace"
    command="edit-workspace"
    shellClass="max-w-128"
    title="guijs.edit-workspace.edit-current-workspace"
  >
    <WorkspaceEditForm
      @close="close()"
    />
  </BaseModal>
</template>
