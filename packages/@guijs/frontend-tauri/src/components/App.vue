<template>
  <div
    id="app"
    class="w-screen h-screen overflow-hidden flex flex-col items-center justify-center p-16
    bg-white dark:bg-gray-850 dark:text-gray-100"
  >
    <div class="box p-16 border border-gray-200 dark:border-gray-950 rounded overflow-hidden w-full">
      <router-view />
    </div>
  </div>
</template>

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
