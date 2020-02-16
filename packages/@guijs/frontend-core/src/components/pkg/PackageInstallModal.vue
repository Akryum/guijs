<script>
const PackageInstall = () => import(
  /* webpackChunkName: 'PackageInstall' */
  './PackageInstall.vue'
)

export default {
  components: {
    PackageInstall,
  },
}
</script>

<template>
  <BaseModal
    keyScope="install-package"
    command="install-package"
    shellClass="max-w-192"
  >
    <template #title="{ commandPayload }">
      <div class="modal-title">
        {{ $t('guijs.install-package.install-package-with-name', { name: commandPayload.packageName }) }}
      </div>
    </template>

    <template #default="{ commandPayload, close }">
      <PackageInstall
        :packageName="commandPayload.packageName"
        @close="close()"
      />
    </template>
  </BaseModal>
</template>
