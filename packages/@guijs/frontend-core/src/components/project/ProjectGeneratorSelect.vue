<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import ProjectTypeLogo from './ProjectTypeLogo.vue'

export default {
  components: {
    ProjectTypeLogo,
  },

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'update',
  },

  setup () {
    const { result } = useQuery(gql`
      query projectGenerators {
        projectGenerators {
          id
          name
          packageName
          projectType {
            id
            name
            logo
          }
        }
      }
    `)

    const generators = useResult(result, [])

    return {
      generators,
    }
  },
}
</script>

<template>
  <VSelect
    v-slot="{ option }"
    v-bind="$attrs"
    :options="generators.map(g => ({
      value: g.id,
      searchText: `${g.name} ${g.projectType.name}`,
      data: g,
    }))"
    searchable
    optionClass="p-2"
    v-on="$listeners"
  >
    <ProjectTypeLogo
      :projectType="option.data.projectType"
      class="w-8 h-8 mr-3 flex-none rounded-sm"
    />

    <div class="flex-1 text-left leading-tight">
      <div>
        {{ option.data.name }}
        <span
          v-if="option.data.name !== option.data.projectType.name"
          class="text-gray-500"
        >
          {{ option.data.projectType.name }}
        </span>
      </div>

      <div
        v-if="option.data.packageName"
        class="text-gray-500"
      >
        <i class="material-icons text-sm">extension</i>
        {{ option.data.packageName }}
      </div>
    </div>
  </VSelect>
</template>
