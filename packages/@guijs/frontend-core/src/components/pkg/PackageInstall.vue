<script>
import gql from 'graphql-tag'
import { useQuery, useResult } from '@vue/apollo-composable'
import PackageLogo from './PackageLogo.vue'
import { packageMetadataFragment } from './fragments'

export default {
  components: {
    PackageLogo,
  },

  props: {
    packageName: {
      type: String,
      required: true,
    },
  },

  setup (props) {
    const { result, loading, refetch } = useQuery(gql`
      query packageMetadata ($id: ID!) {
        packageMetadata (id: $id) {
          ...packageMetadata
        }
      }
      ${packageMetadataFragment}
    `, () => ({
      id: props.packageName,
    }))

    const metadata = useResult(result)

    window.refetch = refetch

    return {
      metadata,
      loading,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <div class="border border-gray-200 dark:border-gray-950 rounded p-6 flex">
      <PackageLogo
        :pkg="metadata"
        class="w-12 h-12 mr-6"
      />

      <!-- Info -->
      <div class="flex-1 overflow-hidden">
        <div class="truncate">
          {{ metadata.id }}
        </div>
        <div class="flex items-baseline truncate">
          <div
            v-if="metadata.description"
            class="text-gray-500 truncate pr-4"
          >
            {{ metadata.description }}
          </div>

          <div
            v-if="metadata.official"
            class="flex-none text-sm text-orange-600 bg-orange-100 dark:text-yellow-300 dark:bg-orange-800 rounded-full px-2 mr-4"
          >
            {{ $t('guijs.package.official') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
