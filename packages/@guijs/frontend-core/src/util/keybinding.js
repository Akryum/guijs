import MouseTrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import 'mousetrap/plugins/pause/mousetrap-pause'
import 'mousetrap/plugins/record/mousetrap-record'
import { apolloClient } from '../apollo'
import gql from 'graphql-tag'
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
    for (let i = index; i < currentScopeChain.length; i++) {
      console.log(i)
      getScopedMousetrap(currentScopeChain[i]).pause()
    }
    currentScopeChain.splice(index, currentScopeChain.length - index)
  }
  debugScopes()
}

function debugScopes () {
  console.log('Keybinding current scopes:', currentScopeChain)
}

apolloClient.watchQuery({
  query: gql`
    query getKeybindings {
      keybindings {
        id
        sequences
        scope
        global
      }
    }
  `,
}).subscribe((result) => {
  applyKeybindings(result.data.keybindings)
})

function applyKeybindings (keybindings) {
  // Reset scopes
  for (const key in scopes) {
    scopes[key].reset()
    scopes = {}
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
    lastKeybindingId = id
    return false
  }
}

export function onKeyboard (id, handler) {
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

export function bindScope (id, elRef) {
  const push = () => {
    pushScope(id)
  }

  const pop = () => {
    popScope(id)
  }

  if (elRef) {
    watch(elRef, (el, oldValue, onCleanup) => {
      if (el) {
        el.addEventListener('focus', push)
        el.addEventListener('blur', pop)
        onCleanup(() => {
          el.removeEventListener('focus', push)
          el.removeEventListener('blur', pop)
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
