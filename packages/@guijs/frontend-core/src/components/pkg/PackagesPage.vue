<script>
import { useRoute, useRouter } from '@/util/router'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { projectPackageFragment } from './fragments'
import { computed, ref, watch } from '@vue/composition-api'
import { runCommand } from '@/util/command'
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

    const { result, onResult, refetch, subscribeToMore } = useQuery(gql`
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

    // @TODO remove when apollo client 3 is used
    setTimeout(() => {
      refetch()
    }, 1500)

    subscribeToMore(() => ({
      document: gql`
        subscription projectPackageAdded ($projectId: ID, $workspaceId: ID) {
          projectPackageAdded (projectId: $projectId, workspaceId: $workspaceId) {
            ...projectPackage
          }
        }
        ${projectPackageFragment}
      `,
      variables: {
        projectId: route.value.params.projectId,
        workspaceId: route.value.params.workspaceId,
      },
      updateQuery: (previousResult, { subscriptionData: { data } }) => {
        previousResult.project.workspace.packages.push(data.projectPackageAdded)
        return previousResult
      },
    }))

    // Project types

    const projectTypes = computed(() => {
      const list = [
        allProjectType,
      ]
      const map = {}

      for (const pkg of packages.value) {
        if (!pkg.metadata.projectTypes.length) {
          if (!map[unknownProjectType.id]) {
            map[unknownProjectType.id] = true
            list.push(unknownProjectType)
          }
        }

        for (const pt of pkg.metadata.projectTypes) {
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

    // Install

    function installPackage () {
      runCommand('install-package-popup')
    }

    return {
      packages,
      projectTypes,
      scroller,
      installPackage,
    }
  },
}
</script>

<template>
  <div class="flex-1 flex items-stretch h-full">
    <div class="flex-none w-64 border-gray-200 dark:border-gray-950 border-r pt-6 overflow-y-auto">
      <VButton
        align="left"
        square
        extend
        class="btn-md w-full hover:bg-primary-100 dark-hover:bg-primary-900"
        @click="installPackage()"
      >
        <i class="material-icons mr-4 text-gray-600 dark:text-gray-400">add</i>
        <div class="flex-1 text-left w-0 truncate">
          {{ $t('guijs.install-package.install-package') }}
        </div>
      </VButton>

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
