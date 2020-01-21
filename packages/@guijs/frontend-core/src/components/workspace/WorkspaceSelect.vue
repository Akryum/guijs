<script>
import WorkspaceList from './WorkspaceList.vue'

export default {
  components: {
    WorkspaceList,
  },
}
</script>

<template>
  <VPopper>
    <div class="flex">
      <VButton
        iconRight="keyboard_arrow_down"
        class="flex-1 btn-md h-72p hover:bg-primary-100 dark-hover:bg-primary-900"
        square
        align="left"
        extend
      >
        Workspace
      </VButton>
    </div>

    <template #popper>
      <WorkspaceList
        class="w-64"
        @select="(id) => $router.push({
          params: {
            workspaceId: id,
          },
        })"
      />
    </template>
  </VPopper>
</template>
