import { inject, computed, onMounted, onUnmounted, reactive, provide, getCurrentInstance } from '@vue/composition-api'

export function useCoupledParent (injectionName) {
  const vm = getCurrentInstance()
  const couplingName = getCouplingName(injectionName)

  const injection = reactive({
    activeChildIndex: null,
    children: [],
  })

  provide(couplingName, injection)

  // Children

  injection.addChild = (couplingData) => {
    // Guard
    if (vm.$slots && vm.$slots.default) {
      // We need to wait for the instances creation
      vm.$nextTick(() => {
        // We need to get the components in the slot
        const foundChildren = vm.$slots.default.reduce((list, vnode) => {
          const coupledChild = findCoupledChild(couplingName, vnode)
          if (coupledChild) {
            list.push(coupledChild[couplingName])
          }
          return list
        }, [])
        // List has the child component in the right order
        // We can now register the child component in the right place
        const index = foundChildren.findIndex(c => c.id === couplingData.id)
        // Add child
        if (index !== -1) {
          injection.children.splice(index, 0, couplingData)

          // If the child was added before the currently active one,
          // we need to move the selection to the right
          if (index <= injection.activeChildIndex) {
            activateChildByIndex(injection.activeChildIndex + 1)
          }
          // Default when there is only one child
          if (injection.children.length === 1) {
            activateChildByIndex(0)
          }
        }
      })
    }
  }

  injection.removeChild = (id) => {
    const index = injection.children.findIndex(item => item.id === id)
    if (index !== -1) injection.children.splice(index, 1)

    // If we remove a child before the currently active one,
    // we need to move the selection to the left
    if (index <= injection.activeChildIndex) {
      activateChildByIndex(injection.activeChildIndex - 1)
    }
  }

  // Activation

  const activeChild = injection.activeChild = computed(() => injection.children[injection.activeChildIndex])

  const onActivateFns = []

  /**
  * Activates a child.
  * @param {number} index Index of child to activate
  * @param {boolean} external Indicates if the activation comes from an external source (like props)
  */
  function activateChildByIndex (index, external = false) {
    const oldIndex = injection.activeChildIndex
    if (index < 0) {
      index = 0
    } else if (index >= injection.children.length) {
      index = injection.children.length - 1
    }
    injection.activeChildIndex = index
    vm.$emit('update:childIndex', index, oldIndex, external)
    onActivateFns.forEach(fn => fn(index, oldIndex, external))
  }

  const activateChild = injection.activateChild = (couplingData, external = false) => {
    const index = injection.children.indexOf(couplingData)
    if (index !== -1) {
      activateChildByIndex(index, external)
    }
  }

  function onActivate (fn) {
    onActivateFns.push(fn)
  }

  const activeChildIndex = computed({
    get: () => injection.activeChildIndex,
    set: value => {
      activateChildByIndex(parseInt(value) || 0, true)
    },
  })

  return {
    children: computed(() => injection.children),
    activeChildIndex,
    onActivate,
    activateChild,
    activeChild,
  }
}

/**
 * @param {string} injectionName Name of the injection
 * @param {string} id
 */
export function useCoupledChild (injectionName, id) {
  const vm = getCurrentInstance()
  if (!id) {
    id = vm._uid
  }
  const couplingName = getCouplingName(injectionName)
  const injection = inject(couplingName)

  const couplingData = vm[couplingName] = {
    id,
    getVm: () => vm,
  }

  const active = computed(() => injection.activeChild.id === id)

  onMounted(() => {
    injection.addChild(couplingData)
  })

  onUnmounted(() => {
    injection.removeChild(couplingData.id)
  })

  function activate () {
    injection.activateChild(couplingData)
  }

  return {
    active,
    activate,
  }
}

function getCouplingName (injectionName) {
  return `$_coupling_${injectionName}`
}

function findCoupledChild (dataPropName, vnode) {
  const vm = vnode.child
  if (vm) {
    if (vm[dataPropName]) {
      return vm
    } else {
      return findCoupledChildInChildren([...vm.$children])
    }
  }
}

// Breadth-first search
function findCoupledChildInChildren (dataPropName, queue) {
  let child
  while ((child = queue.shift())) {
    if (child[dataPropName]) {
      return child
    } else {
      queue.push(...child.$children)
    }
  }
}
