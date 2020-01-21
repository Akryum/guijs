<script>
import WorkspaceList from './WorkspaceList.vue'
import { ref, watch } from '@vue/composition-api'
import { useRouter, useRoute } from '@/util/router'

export default {
  components: {
    WorkspaceList,
  },

  setup () {
    const isOpen = ref(false)
    const router = useRouter()
    const route = useRoute()

    function select (id) {
      router.push({
        params: {
          workspaceId: id,
        },
      })
      isOpen.value = false
    }

    // Auto select __root
    watch(route, value => {
      if (!route.value.params.workspaceId) {
        router.push({
          params: {
            workspaceId: '__root',
          },
        })
      }
    })

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
