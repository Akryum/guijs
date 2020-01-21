<script>
import WorkspaceList from './WorkspaceList.vue'
import { ref } from '@vue/composition-api'
import { useRouter } from '@/util/router'

export default {
  components: {
    WorkspaceList,
  },

  setup () {
    const isOpen = ref(false)
    const router = useRouter()

    function select (id) {
      router.push({
        params: {
          workspaceId: id,
        },
      })
      isOpen.value = false
    }

    return {
      isOpen,
      select,
    }
  },
}
</script>

<template>
  <VPopper
    :open.sync="isOpen"
  >
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
        @select="select"
      />
    </template>
  </VPopper>
</template>
