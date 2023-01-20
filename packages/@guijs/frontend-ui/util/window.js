import { onMounted, onUnmounted } from 'vue'

export function onWindowEvent (type, handler, options) {
  onMounted(() => {
    window.addEventListener(type, handler, options)
  })

  onUnmounted(() => {
    window.removeEventListener(type, handler)
  })
}
