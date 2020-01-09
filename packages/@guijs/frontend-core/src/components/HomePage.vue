<template>
  <div class="flex flex-col items-center justify-center h-full">
    <img
      src="~@/assets/guijs.svg"
      alt="guijs logo"
      class="max-w-32 max-h-32"
    >
    <h1 class="text-gray-600 text-2xl mt-6">
      {{ $t('guijs.home.welcome') }}
    </h1>

    <VButton
      class="btn-primary btn-regular mt-4"
      icon-left="star"
    >
      Hello
    </VButton>
  </div>
</template>
