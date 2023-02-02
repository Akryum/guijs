import { onKey } from './keybinding'
import { ref, watch } from 'vue'

const keys = {
  vertical: {
    previous: 'up',
    next: 'down',
  },
  horizontal: {
    previous: 'left',
    next: 'right',
  },
}

export function useKeyboardNavigation (itemsRef, scope, direction = 'vertical') {
  const selectedIndex = ref(0)

  watch(itemsRef, () => {
    selectedIndex.value = 0
  })

  const selectHandlers = []

  function onSelect (handler) {
    selectHandlers.push(handler)
  }

  const directionKeys = keys[direction]

  onKey('enter', () => {
    selectHandlers.forEach(h => h(itemsRef.value[selectedIndex.value], selectedIndex.value))
  }, {
    scope,
    global: true,
    action: 'keyup',
  })

  onKey(directionKeys.previous, () => {
    selectedIndex.value--
    if (selectedIndex.value < 0) {
      selectedIndex.value = itemsRef.value.length - 1
    }
  }, {
    scope,
    global: true,
  })

  onKey(directionKeys.next, () => {
    selectedIndex.value++
    if (selectedIndex.value > itemsRef.value.length - 1) {
      selectedIndex.value = 0
    }
  }, {
    scope,
    global: true,
  })

  return {
    selectedIndex,
    onSelect,
  }
}
