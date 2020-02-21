<script>
import NoProjectOpen from './NoProjectOpen.vue'
import ProjectDropdown from '../project/ProjectDropdown.vue'
import ProjectNav from './ProjectNav.vue'

export default {
  components: {
    NoProjectOpen,
    ProjectDropdown,
    ProjectNav,
  },

  setup () {

  },
}
</script>

<template>
  <div
    class="bg-gray-100 border-gray-200 border-r w-48
    dark:bg-gray-900 dark:border-gray-950 overflow-hidden"
  >
    <NoProjectOpen v-if="!$route.params.projectId" />

    <template v-else>
      <ProjectDropdown
        class="mb-6"
      />

      <ProjectNav />
    </template>
  </div>
</template>
