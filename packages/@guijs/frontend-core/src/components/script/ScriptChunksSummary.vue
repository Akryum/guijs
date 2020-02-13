<script>
import ScriptChunkArgsView from './ScriptChunkArgsView.vue'

export default {
  components: {
    ScriptChunkArgsView,
  },

  props: {
    chunks: {
      type: Array,
      required: true,
    },
  },
}
</script>

<template>
  <div class="font-mono flex items-start">
    <div
      v-for="chunk of chunks"
      :key="chunk.id"
      class="mr-2"
    >
      <!-- Operators -->
      <div
        v-if="chunk.type === 'operator'"
        class="text-gray-500"
      >
        {{ chunk.base }}
      </div>

      <!-- Commands -->
      <div
        v-else
        class="flex flex-col items-stretch"
      >
        <div>
          <!-- Base -->
          <span class="text-red-500">
            {{ chunk.base }}
          </span>

          <!-- Main arguments -->
          <span
            v-for="(arg, index) of chunk.args._"
            :key="index"
            class="text-purple-500"
          >
            {{ arg }}
          </span>

          <!-- Secondary arguments -->
          <ScriptChunkArgsView
            :chunk="chunk"
          />
        </div>

        <div class="border-t border-gray-300 dark:border-gray-700 text-center uppercase mt-2">
          {{ chunk.id }}
        </div>
      </div>
    </div>
  </div>
</template>
