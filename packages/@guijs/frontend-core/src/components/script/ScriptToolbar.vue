<template>
  <div class="flex items-center p-6">
    <!-- Actions -->
    <VButton
      iconLeft="play_arrow"
      class="btn-lg btn-primary"
    >
      {{ $t('guijs.script.run-script') }}
    </VButton>
    <!-- <VButton
      iconLeft="stop"
      class="btn-lg btn-primary"
    >
      {{ $t('guijs.script.stop-script') }}
    </VButton> -->

    <VButton
      v-tooltip="$t('guijs.script.edit-script')"
      iconLeft="edit"
      disabled
      class="p-4 btn-dim ml-4"
    />

    <!-- Views -->
    <div class="flex-1 flex items-center justify-end">
      <!-- @TODO ButtonGroup -->
      <VButton
        iconLeft="dvr"
        class="btn-lg btn-dim"
      >
        {{ $t('guijs.script.output') }}
      </VButton>
    </div>
  </div>
</template>
