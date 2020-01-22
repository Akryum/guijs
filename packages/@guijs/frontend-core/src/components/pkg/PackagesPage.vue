<script>
import { useRoute, useRouter } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectPackageFragment } from './fragments'
import { computed, ref, watch } from '@vue/composition-api'
import ProjectTypeList from './ProjectTypeList.vue'

const allProjectType = {
  id: '__all',
  name: 'guijs.package.all',
  icon: 'extension',
}

const unknownProjectType = {
  id: '__unknown',
  name: 'guijs.package.unknown',
  logo: require('@/assets/box.svg'),
}

export default {
  components: {
    ProjectTypeList,
  },

  setup () {
    const route = useRoute()
    const router = useRouter()

    const { result, onResult } = useQuery(gql`
      query projectPackages ($projectId: ID!, $workspaceId: ID!) {
        project (id: $projectId) {
          id
          workspace (id: $workspaceId) {
            id
            packages {
              ...projectPackage
            }
          }
        }
      }
      ${projectPackageFragment}
    `, () => ({
      projectId: route.value.params.projectId,
      workspaceId: route.value.params.workspaceId,
    }), () => ({
      fetchPolicy: 'cache-and-network',
      enabled: !!route.value.params.projectId && !!route.value.params.workspaceId,
    }))
    const packages = useResult(result, [], data => data.project.workspace.packages)

    // Project types

    const projectTypes = computed(() => {
      const list = [
        allProjectType,
      ]
      const map = {}

      for (const pkg of packages.value) {
        if (!pkg.projectTypes.length) {
          if (!map[unknownProjectType.id]) {
            map[unknownProjectType.id] = true
            list.push(unknownProjectType)
          }
        }

        for (const pt of pkg.projectTypes) {
          if (!map[pt.id]) {
            map[pt.id] = true
            list.push(pt)
          }
        }
      }

      return list.sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => {
          if (a.id === allProjectType.id) return -1
          if (b.id === allProjectType.id) return 1
          if (a.id === unknownProjectType.id) return 1
          if (b.id === unknownProjectType.id) return -1
          return 0
        })
    })

    // Scrolling

    const scroller = ref(null)

    // Scroll to top
    watch(() => route.value.params.projectTypeId, (value) => {
      if (scroller.value) {
        scroller.value.scrollTop = 0
      }
    })

    // Unselect project type if it doesn't exist
    onResult(result => {
      if (!result.loading &&
        route.value.params.projectTypeId &&
        !projectTypes.value.some(pt => pt.id === route.value.params.projectTypeId)) {
        router.push({
          name: 'project-packages',
          params: {
            workspaceId: route.value.params.workspaceId,
          },
        })
      }
    })

    return {
      packages,
      projectTypes,
      scroller,
    }
  },
}
</script>

<template>
  <div class="flex-1 flex items-stretch h-full">
    <div class="flex-none w-64 border-gray-200 dark:border-gray-950 border-r pt-4 overflow-y-auto">
      <ProjectTypeList
        :projectTypes="projectTypes"
      />
    </div>
    <main
      ref="scroller"
      class="flex-1 overflow-y-auto"
    >
      <router-view
        :packages="packages"
      />
    </main>
  </div>
</template>
