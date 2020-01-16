<script>
import { ref } from '@vue/composition-api'
import { bindScope, onKey } from '@/util/keybinding'
import { onCommand } from '@/util/command'
const ImportProjectForm = () => import(
  /* webpackChunkName: 'ImportProjectForm' */
  './ImportProjectForm.vue'
)

export default {
  components: {
    ImportProjectForm,
  },

  setup () {
    const isOpen = ref(false)

    bindScope('import-project', isOpen)

    onKey('esc', () => {
      isOpen.value = false
    }, {
      scope: 'import-project',
      global: true,
    })

    onCommand('import-project', () => {
      isOpen.value = true
    })

    return {
      isOpen,
    }
  },
}
</script>

<template>
  <VModal
    v-if="isOpen"
    shell-class="max-w-128"
    @close="isOpen = false"
  >
    <template #title>
      <div class="modal-title">
        {{ $t('guijs.import-project.import-a-project') }}
      </div>
    </template>

    <ImportProjectForm />
  </VModal>
</template>
