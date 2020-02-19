<script>
import { ref } from '@vue/composition-api'
import FileInput from '../form/FileInput.vue'
import ProjectGeneratorSelect from './ProjectGeneratorSelect.vue'

export default {
  components: {
    FileInput,
    ProjectGeneratorSelect,
  },

  setup () {
    const monorepo = ref(null)
    const name = ref('')
    const baseFolder = ref('')
    const projectGeneratorId = ref(null)

    return {
      monorepo,
      name,
      baseFolder,
      projectGeneratorId,
    }
  },
}
</script>

<template>
  <div class="p-6">
    <VButton
      align="left"
      class="form-input w-full"
      :class="{
        'text-primary-500 bg-primary-100 dark:text-primary-300 dark:bg-primary-900': monorepo === false,
      }"
      @click="monorepo = false"
    >
      <img
        src="~@/assets/folder.png"
        alt="Folder icon"
        class="w-10 h-10 mr-6"
      >
      <div class="text-left">
        <div>{{ $t('guijs.create-project.simple-project') }}</div>
        <div class="text-gray-500 whitespace-normal">
          {{ $t('guijs.create-project.simple-project-description') }}
        </div>
      </div>
    </VButton>

    <VButton
      align="left"
      class="form-input w-full mt-6"
      :class="{
        'text-primary-500 bg-primary-100 dark:text-primary-300 dark:bg-primary-900': monorepo,
      }"
      @click="monorepo = true"
    >
      <img
        src="~@/assets/folder-tree.png"
        alt="Folder icon"
        class="w-10 h-10 mr-6"
      >
      <div class="text-left">
        <div>{{ $t('guijs.create-project.mono-repo') }}</div>
        <div class="text-gray-500 whitespace-normal">
          {{ $t('guijs.create-project.mono-repo-description') }}
        </div>
      </div>
    </VButton>

    <template v-if="monorepo != null">
      <hr class="my-6 border-gray-200 dark:border-gray-950">

      <FileInput
        v-model="baseFolder"
        directory
      />

      <VInput
        v-model="name"
        label="guijs.create-project.input-name-label"
        placeholder="guijs.create-project.input-name-placeholder"
        class="form-input mt-6"
      />

      <div class="border border-gray-200 dark:border-gray-950 rounded px-6 py-4 mt-6">
        {{ baseFolder }}/<b class="text-primary-500">{{ name }}</b>
      </div>

      <ProjectGeneratorSelect
        v-if="!monorepo"
        v-model="projectGeneratorId"
        buttonClass="form-input"
        label="guijs.create-project.input-generator-label"
        placeholder="guijs.create-project.input-generator-placeholder"
        class="mt-6"
      />

      <!-- Actions -->
      <div class="flex mt-6">
        <VButton
          :disabled="!baseFolder || !name || (!monorepo && !projectGeneratorId)"
          iconLeft="done"
          class="flex-1 btn-lg btn-primary"
        >
          {{ $t('guijs.common.proceed') }}
        </VButton>
      </div>
    </template>
  </div>
</template>
