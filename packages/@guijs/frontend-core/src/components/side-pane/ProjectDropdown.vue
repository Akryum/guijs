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
  <VDropdown
    v-if="project"
  >
    <div class="flex">
      <VButton
        :iconLeft="project.bookmarked ? 'bookmark' : 'bookmark_border'"
        iconRight="keyboard_arrow_down"
        class="flex-1 btn-md h-72p hover:bg-primary-100 dark-hover:bg-primary-900
        border-gray-200 border-b"
        square
        align="left"
        extend
      >
        {{ project.name }}
      </VButton>
    </div>

    <template #popper>
      No recent project
    </template>
  </VDropdown>

  <VError
    v-else-if="!loading"
    error="guijs.side-pane.project-not-found"
    class="mx-6"
  />
</template>
