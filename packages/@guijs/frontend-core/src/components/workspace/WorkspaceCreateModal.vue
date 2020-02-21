<script>
const WorkspaceCreateForm = () => import(
  /* webpackChunkName: 'WorkspaceCreateForm' */
  './WorkspaceCreateForm.vue'
)

export default {
  components: {
    WorkspaceCreateForm,
  },
}
</script>

<template>
  <BaseModal
    v-slot="{ close }"
    keyScope="create-workspace"
    command="create-workspace"
    shellClass="max-w-128"
    title="guijs.create-workspace.create-a-workspace"
  >
    <WorkspaceCreateForm
      @close="close()"
    />
  </BaseModal>
</template>
