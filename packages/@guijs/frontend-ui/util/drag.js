import { ref, watch } from '@vue/composition-api'

export function onDrag (elRef, handler) {
  const previewX = ref(0)
  const previewY = ref(0)

  watch(elRef, (el, oldValue, onCleanup) => {
    if (el) {
      let initialPosition

      // Start
      function onMouseDown (event) {
        initialPosition = {
          x: event.clientX,
          y: event.clientY,
        }
        previewX.value = 0
        previewY.value = 0
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)
      }

      // Preview
      function onMouseMove (event) {
        previewX.value = event.clientX - initialPosition.x
        previewY.value = event.clientY - initialPosition.y
      }

      // End
      function onMouseUp (event) {
        previewX.value = 0
        previewY.value = 0
        const dX = event.clientX - initialPosition.x
        const dY = event.clientY - initialPosition.y
        handler({ dX, dY })
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      }

      el.addEventListener('mousedown', onMouseDown)

      onCleanup(() => {
        el.removeEventListener('mousedown', onMouseDown)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', onMouseUp)
      })
    }
  })

  return {
    previewX,
    previewY,
  }
}
