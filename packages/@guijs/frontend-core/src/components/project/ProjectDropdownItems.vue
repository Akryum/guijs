<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { useKeyboardNavigation } from '@guijs/frontend-ui/util/navigation'
import { bindScope } from '@/util/keybinding'
import { runCommand } from '@/util/command'

export default {
  setup () {
    const { result, loading } = useQuery(gql`
      query projectDropdownItems {
        bookmarkedProjects {
          ...project
        }
        recentProjects {
          ...project
        }
      }
      fragment project on Project {
        id
        name
        bookmarked
      }
    `)

    const projects = useResult(result, [], data => data.bookmarkedProjects.concat(data.recentProjects))

    function selectProject (project) {
      runCommand('open-project', {
        projectId: project.id,
      })
    }

    // Keybindings
    bindScope('project-dropdown')

    const { selectedIndex, onSelect } = useKeyboardNavigation(projects, 'project-dropdown')

    onSelect(project => {
      // console.log(project)
      selectProject(project)
    })

    return {
      projects,
      loading,
      selectedIndex,
      selectProject,
    }
  },
}
</script>

<template>
  <div
    ref="el"
    class="flex flex-col items-stretch"
  >
    <div>
      {{ $t('') }}
    </div>

    <VButton
      v-for="(project, index) of projects"
      :key="project.id"
      class="p-4"
      :class="{
        'bg-primary-100 dark:bg-primary-900': index === selectedIndex,
      }"
      align="left"
      extend
      square
      @mouseover.native="selectedIndex = index"
      @click="selectProject(project)"
    >
      <i class="material-icons text-gray-700 dark:text-gray-300 mr-2 text-lg">
        {{ project.bookmarked ? 'bookmark' : 'update' }}
      </i>
      {{ project.name }}
    </VButton>

    <VEmpty
      v-if="!loading && !projects.length"
      class="py-6"
    >
      {{ $t('guijs.project-dropdown.no-recent-projects') }}
    </VEmpty>
  </div>
</template>
