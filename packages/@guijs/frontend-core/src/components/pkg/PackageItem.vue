<script>
import PackageLogo from './PackageLogo.vue'

export default {
  components: {
    PackageLogo,
  },

  props: {
    pkg: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="mb-6 border border-gray-200 dark:border-gray-950 rounded p-6 flex items-center overflow-hidden">
    <PackageLogo
      :pkg="pkg"
      class="w-12 h-12 mr-6"
    />

    <!-- Info -->
    <div class="flex-1 overflow-hidden">
      <div class="truncate">
        {{ pkg.id }}
      </div>
      <div class="flex items-baseline truncate">
        <div
          v-if="pkg.description"
          class="text-gray-500 truncate pr-4"
        >
          {{ pkg.description }}
        </div>

        <div
          v-if="pkg.official"
          class="flex-none text-sm text-orange-600 bg-orange-100 dark:text-yellow-300 dark:bg-orange-800 rounded-full px-2 mr-4"
        >
          {{ $t('guijs.package.official') }}
        </div>

        <div
          v-if="pkg.isWorkspace"
          class="flex-none text-sm text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800 rounded-full px-2 mr-4"
        >
          {{ $t('guijs.package.workspace') }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex-none flex">
      <VButton
        v-if="pkg.metadataId"
        v-tooltip="$t('guijs.common.more-info')"
        :href="`https://awesomejs.dev/for/${pkg.projectTypes[0].slug}/pkg/${pkg.metadataId}`"
        iconLeft="info"
        target="_blank"
        class="p-2 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark-hover:bg-primary-900"
      />
      <VButton
        v-else
        v-tooltip="$t('guijs.package.improve-metadata')"
        :href="`https://awesomejs.dev/pkg/add?packageName=${encodeURIComponent(pkg.id)}`"
        iconLeft="add_circle_outline"
        target="_blank"
        class="p-2 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark-hover:bg-primary-900"
      />
    </div>
  </div>
</template>
