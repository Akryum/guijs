<template>
  <div class="loading-animation flex items-center justify-center">
    <div class="bg w-20 h-2 rounded-full overflow-hidden">
      <div class="bar w-12 h-full rounded-full" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.bg {
  background: rgba(0, 0, 0, .25);

  .loading-animation.dark & {
    background: rgba(255, 255, 225, .25);
  }
}

.bar {
  background: theme('colors.white');
  opacity: 0.9;
  animation: bar-move 1s linear infinite;

  .loading-animation.dark & {
    background: theme('colors.black');
    opacity: 0.8;
  }
}

@keyframes bar-move {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
</style>
