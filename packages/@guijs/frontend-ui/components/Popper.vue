<script>
import { ref, watch, getCurrentInstance, onUnmounted } from '@vue/composition-api'

const shownUids = new Set()

export default {
  inheritAttrs: false,

  setup () {
    const popper = ref()

    const shown = ref()
    const vm = getCurrentInstance()

    /* Animation */

    function triggerHide () {
      shownUids.delete(vm._uid)
      if (!shownUids.size) {
        document.body.classList.remove('popper-open')
      }
    }

    watch(shown, value => {
      if (value) {
        shownUids.add(vm._uid)
        document.body.classList.add('popper-open')
        animate()
      } else {
        triggerHide()
      }
    }, { lazy: true })

    onUnmounted(triggerHide)

    function animate () {
      const trigger = popper.value.$refs.trigger
      const triggerBounds = trigger.getBoundingClientRect()

      const popperContent = popper.value.$refs.popperContent
      const wrapper = popperContent.$el.querySelector('.v-popper__wrapper')
      wrapper.classList.remove('animate')
      const wrapperBounds = wrapper.getBoundingClientRect()

      // Compute popover wrapper <div> transformOrigin
      const x = (triggerBounds.left + triggerBounds.width / 2) - wrapperBounds.left
      const y = (triggerBounds.top + triggerBounds.height / 2) - wrapperBounds.top

      wrapper.style.transformOrigin = `${x}px ${y}px`
      requestAnimationFrame(() => {
        wrapper.classList.add('animate')
      })
    }

    return {
      popper,
      shown,
    }
  },
}
</script>

<template>
  <VDropdown
    ref="popper"
    v-bind="$attrs"
    v-on="$listeners"
    @apply-show="shown = true"
    @apply-hide="shown = false"
  >
    <slot />
    <template #popper>
      <slot name="popper" />
    </template>
  </VDropdown>
</template>
