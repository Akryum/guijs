<script>
import WorkspaceSelect from '../workspace/WorkspaceSelect.vue'

export default {
  components: {
    WorkspaceSelect,
  },
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <header
      v-if="!$route.matched.some(m => m.meta.hideHeader)"
      class="h-72p border-gray-200 dark:border-gray-950 border-b flex items-stretch"
    >
      <div
        v-if="!$route.matched.some(m => m.meta.hideWorkspaceSelect)"
        class="w-64 border-gray-200 dark:border-gray-950 border-r"
      >
        <WorkspaceSelect
          class="h-full"
        />
      </div>
      <div>
        <router-view name="header" />
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 flex items-stretch">
      <aside
        v-if="!$route.matched.some(m => m.meta.hideAside)"
        class="w-64 border-gray-200 dark:border-gray-950 border-r"
      >
        <router-view name="aside" />
      </aside>
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>
