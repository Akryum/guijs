<template>
  <div
    id="app"
  >
    <splashscreen v-if="state.name === 'splashscreen'" />
    <div
      v-else
      class="w-screen h-screen overflow-hidden flex flex-col items-center justify-center p-16
    bg-white dark:bg-gray-850 dark:text-gray-100"
    >
      <div class="box p-16 border border-gray-200 dark:border-gray-950 rounded overflow-hidden w-full">
        <component
          :is="component"
          :payload="state.payload"
        />
      </div>
    </div>
  </div>
</template>

<script>

import FirstDownload from './FirstDownload.vue'
import UpdateProgress from './UpdateProgress.vue'
import UpdatePrompt from './UpdatePrompt.vue'
import NodeNotFound from './NodeNotFound.vue'
import NodeWrongVersion from './NodeWrongVersion.vue'
import Splashscreen from './Splashscreen.vue'
import { listen } from '@tauri-apps/api/event'

export default {
  components: {
    Splashscreen,
  },

  data () {
    return {
      state: {
        name: 'splashscreen',
        payload: null,
      },
    }
  },

  computed: {
    component () {
      switch (this.state.name) {
        case 'first-download':
          return FirstDownload
        case 'update-available':
          return UpdatePrompt
        case 'downloading-update':
          return UpdateProgress
        case 'node-not-found':
          return NodeNotFound
        case 'node-wrong-version':
          return NodeWrongVersion
        case 'splashscreen':
          return Splashscreen
        default:
          return null
      }
    },
  },

  beforeCreate () {
    listen('state', ({ payload }) => {
      this.state = payload
    })
  },
}

</script>

<style lang="postcss">
@import '~@guijs/frontend-ui/styles/tailwind-light.postcss';

a {
  @apply text-purple-500 underline;
}
</style>

<style lang="postcss" scoped>
.box {
  max-width: 700px;
}
</style>
