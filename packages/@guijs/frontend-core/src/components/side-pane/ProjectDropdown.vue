<script>
import { useCurrentProject } from '@/util/project'

export default {
  setup () {
    const { project, loading } = useCurrentProject()

    return {
      project,
      loading,
    }
  },
}
</script>

<template>
  <VPopper
    v-if="project"
  >
    <div class="flex overflow-hidden">
      <VButton
        :iconLeft="project.bookmarked ? 'bookmark' : 'bookmark_border'"
        iconRight="keyboard_arrow_down"
        class="flex-1 w-full btn-md h-72p hover:bg-primary-100 dark-hover:bg-primary-900
        border-gray-200 dark:border-gray-950 border-b"
        square
        align="left"
        extend
      >
        <div class="flex-1 w-0 truncate leading-normal">
          {{ project.name }}
        </div>
      </VButton>
    </div>

    <template #popper>
      <div class="w-64">
        No recent project
      </div>
    </template>
  </VPopper>

  <VError
    v-else-if="!loading"
    error="guijs.side-pane.project-not-found"
    class="mx-6"
  />
</template>
