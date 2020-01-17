<script>
import NoProjectOpen from './NoProjectOpen.vue'
import ProjectDropdown from './ProjectDropdown.vue'
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
    class="bg-gray-100 border-gray-200 border-r w-64
    dark:bg-gray-900 dark:border-gray-950"
  >
    <NoProjectOpen v-if="!$route.params.projectId" />

    <template v-else>
      <ProjectDropdown />

      <ProjectNav />
    </template>
  </div>
</template>
