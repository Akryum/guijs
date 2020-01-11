<script>
import { runCommand } from '@/util/command'

export default {
  setup () {
    return {
      runCommand,
    }
  },
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-full p-8">
    <div class="flex flex-col">
      <div class="flex items-center mb-16">
        <img
          src="~@/assets/guijs.svg"
          alt="guijs logo"
          class="flex-none w-12 h-12 bg-gray-300 rounded-full text-transparent mr-8"
        >
        <h1 class="text-gray-600 text-2xl">
          {{ $t('guijs.home.welcome') }}
        </h1>
      </div>

      <div class="flex mb-16">
        <!-- Recent projects -->
        <div class="mr-32">
          <h2 class="text-lg mb-8">
            {{ $t('guijs.home.recent-projects') }}
          </h2>
          <div class="text-gray-500">
            No recent projects
          </div>
        </div>

        <!-- Quick actions -->
        <div>
          <h2 class="text-lg mb-8">
            {{ $t('guijs.home.quick-actions') }}
          </h2>
          <div class="flex flex-col items-start">
            <VButton
              class="text-secondary-600 mb-2"
              @click="runCommand('command')"
            >
              {{ $t('guijs.home.show-all-commands') }}
            </VButton>

            <VButton
              class="text-secondary-600 mb-2"
              @click="runCommand('find-projects')"
            >
              {{ $t('guijs.home.recent-projects') }}
            </VButton>
          </div>
        </div>
      </div>

      <div class="flex">
        <!-- Help -->
        <div class="mr-32">
          <h2 class="text-lg mb-8">
            {{ $t('guijs.home.help') }}
          </h2>
          <div class="flex flex-col items-start">
            <VButton
              class="text-secondary-600 mb-2"
              href="https://github.com/Akryum/guijs"
              target="_blank"
            >
              {{ $t('guijs.home.github-repository') }}
            </VButton>

            <VButton
              class="text-secondary-600 mb-2"
              href="https://guijs.dev"
              target="_blank"
            >
              {{ $t('guijs.home.website') }}
            </VButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
