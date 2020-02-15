<script>
const PackageInstallPopup = () => import(
  /* webpackChunkName: 'PackageInstallPopup' */
  './PackageInstallPopup.vue'
)

export default {
  components: {
    PackageInstallPopup,
  },
}
</script>

<template>
  <BaseModal
    keyScope="install-package-popup"
    command="install-package-popup"
    fullscreen
  >
    <template #title>
      <div class="flex h-full items-center">
        <div class="modal-title">
          {{ $t('guijs.install-package.install-package') }}
        </div>

        <portal-target
          name="install-package-popup-title"
          class="flex-1 flex items-center"
        />
      </div>
    </template>

    <template #default="{ commandPayload, close }">
      <PackageInstallPopup
        :projectTypeSlug="commandPayload.projectTypeSlug"
        @close="close()"
      />
    </template>
  </BaseModal>
</template>
