<script>
const CreateProjectForm = () => import(
  /* webpackChunkName: 'CreateProjectForm' */
  './CreateProjectForm.vue'
)

export default {
  components: {
    CreateProjectForm,
  },
}
</script>

<template>
  <BaseModal
    v-slot="{ close }"
    keyScope="create-project"
    command="create-project"
    shellClass="max-w-128"
    title="guijs.create-project.create-a-project"
  >
    <CreateProjectForm
      @close="close()"
    />
  </BaseModal>
</template>
