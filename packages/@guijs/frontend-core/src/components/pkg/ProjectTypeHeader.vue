<script>
import { useRoute } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { computed } from '@vue/composition-api'

export default {
  setup () {
    const route = useRoute()

    const projectTypeId = computed(() => route.value.params.projectTypeId)
    const isSpecial = computed(() => projectTypeId.value && projectTypeId.value.startsWith('__'))

    const { result } = useQuery(gql`
      query projectType ($id: ID!) {
        projectType (id: $id) {
          id
          name
          slug
          logo
        }
      }
    `, () => ({
      id: projectTypeId.value,
    }), () => ({
      enabled: !!projectTypeId.value && !isSpecial.value,
    }))

    const projectType = useResult(result)

    return {
      projectType,
      projectTypeId,
      isSpecial,
    }
  },
}
</script>

<template>
  <div
    v-if="projectTypeId && !isSpecial && projectType"
    class="flex items-center h-full px-6"
  >
    <img
      :src="projectType.logo"
      alt="Logo"
      class="w-6 h-6 rounded mr-4 flex-none"
    >
    <div class="flex-1 text-left w-0 truncate">
      {{ $t(projectType.name) }}
    </div>
  </div>
</template>
