import MouseTrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import 'mousetrap/plugins/pause/mousetrap-pause'
import 'mousetrap/plugins/record/mousetrap-record'
import { onUnmounted, onMounted, onActivated, watch } from '@vue/composition-api'

/** @type {{ [key: string]: InstanceType<MouseTrap> }} */
let scopes = {}

let currentScopeChain = ['root']

function getScopedMousetrap (scopeId) {
  let scope = scopes[scopeId]
  if (!scope) {
    scope = scopes[scopeId] = new MouseTrap()
    scope.pause()
  }
  return scope
}

export function pushScope (id) {
  if (currentScopeChain.includes(id)) return
  currentScopeChain.push(id)
  getScopedMousetrap(id).unpause()
  debugScopes()
}

export function popScope (id) {
  const index = currentScopeChain.indexOf(id)
  if (index !== -1) {
    const newChain = []
    const reg = new RegExp(`${id}.`)
    for (const scope of currentScopeChain) {
      if (scope === id || reg.test(scope)) {
        getScopedMousetrap(scope).pause()
      } else {
        newChain.push(scope)
      }
    }
    currentScopeChain = newChain
  }
  debugScopes()
}

function debugScopes () {
  console.log('Keybinding current scopes:', currentScopeChain)
}

export function applyKeybindings (keybindings) {
  // Reset scopes
  for (const scope in scopes) {
    const mousetrap = scopes[scope]
    mousetrap.reset()
    // Restore key handlers
    const handlers = getKeyHandlers(scope)
    for (const h of handlers) {
      if (h.global) {
        mousetrap.bindGlobal(h.keys, h.handler)
      } else {
        mousetrap.bind(h.keys, h.handler)
      }
    }
  }

  for (const keybinding of keybindings) {
    const mousetrap = getScopedMousetrap(keybinding.scope)
    if (keybinding.global) {
      mousetrap.bindGlobal(keybinding.sequences, registerKeybinding(keybinding.id))
    } else {
      mousetrap.bind(keybinding.sequences, registerKeybinding(keybinding.id))
    }
  }

  for (const scopeId of currentScopeChain) {
    getScopedMousetrap(scopeId).unpause()
  }

  debugScopes()
}

/** @type {{ [key: string]: Function[] }} */
const handlers = {}
/** @type {Function[]} */
const globalHandlers = []

export function onAnyKeybind (handler) {
  globalHandlers.push(handler)
  onUnmounted(() => {
    const index = globalHandlers.indexOf(handler)
    if (index !== -1) globalHandlers.splice(index, 1)
  })
}

function getKeybindingHandlers (id) {
  let result = handlers[id]
  if (!result) {
    result = handlers[id] = []
  }
  return result
}

let lastKeybindingId = null

function registerKeybinding (id) {
  return (event) => {
    getKeybindingHandlers(id).forEach(handler => {
      handler(event)
    })
    globalHandlers.forEach(handler => {
      handler(id, event)
    })
    lastKeybindingId = id
    return false
  }
}

export function onKeybind (id, handler) {
  getKeybindingHandlers(id).push(handler)

  if (lastKeybindingId === id) {
    handler()
  }

  onUnmounted(() => {
    const list = getKeybindingHandlers(id)
    const index = list.indexOf(handler)
    if (index !== -1) list.splice(index, 1)
  })
}

const keyHandlers = {}

function getKeyHandlers (scope) {
  let handlers = keyHandlers[scope]
  if (!handlers) {
    handlers = keyHandlers[scope] = []
  }
  return handlers
}

export function onKey (keys, handler, options = {}) {
  const scope = options.scope || 'root'
  const h = {
    keys,
    handler,
    global: options.global,
  }
  getKeyHandlers(scope).push(h)
  if (options.global) {
    getScopedMousetrap(scope).bindGlobal(keys, handler)
  } else {
    getScopedMousetrap(scope).bind(keys, handler)
  }

  const off = () => {
    const list = getKeyHandlers(scope)
    const index = list.indexOf(h)
    if (index !== -1) list.splice(index, 1)
    getScopedMousetrap(scope).unbind(keys, handler)
  }

  onUnmounted(() => off())

  return {
    off,
  }
}

export function bindScope (id, ref) {
  const push = () => {
    pushScope(id)
  }

  const pop = () => {
    popScope(id)
  }

  if (ref) {
    watch(ref, (value, oldValue, onCleanup) => {
      if (typeof value === 'boolean') {
        if (value) {
          push()
        } else {
          pop()
        }
      } else if (value instanceof Element) {
        value.addEventListener('focusin', push)
        value.addEventListener('focusout', pop)
        onCleanup(() => {
          value.removeEventListener('focusin', push)
          value.removeEventListener('focusout', pop)
        })
      }
    })
  } else {
    onMounted(push)
    onActivated(push)
  }

  onUnmounted(pop)
}

// Debug sequences
function recordSequence () {
  MouseTrap.record(sequence => {
    console.log('sequence', sequence)
    setTimeout(recordSequence, 100)
  })
}
recordSequence()
