<script>
import { ref } from '@vue/composition-api'
import FileInput from '../fs/FileInput.vue'

export default {
  components: {
    FileInput,
  },

  setup () {
    const folder = ref(null)

    return {
      folder,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <FileInput
      v-model="folder"
      directory
    />

    <div class="flex mt-6">
      <VButton
        v-if="folder"
        icon-left="unarchive"
        class="flex-1 btn-lg btn-primary"
      >
        {{ $t('guijs.import-project.import-button') }}
      </VButton>
    </div>
  </div>
</template>
