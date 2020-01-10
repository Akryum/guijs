import { onUnmounted, onActivated } from '@vue/composition-api'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'

const handlers = {}

function getHandlers (id) {
  let result = handlers[id]
  if (!result) {
    result = handlers[id] = []
  }
  return result
}

let lastCommand = null

export function onCommand (id, handler) {
  const add = () => {
    getHandlers(id).push(handler)
    if (lastCommand === id) {
      handler()
    }
  }

  const remove = () => {
    const list = getHandlers(id)
    const index = list.indexOf(handler)
    if (index !== -1) list.splice(index, 1)
  }

  add()
  onActivated(() => add())

  onUnmounted(() => remove())
}

export function dispatchCommand (id) {
  getHandlers(id).forEach(handler => handler())
  lastCommand = id
}

export function runCommand (id) {
  return apolloClient.mutate({
    mutation: gql`
    mutation runCommand ($id: ID!) {
      runCommand (id: $id) {
        id
      }
    }
  `,
    variables: {
      id,
    },
  })
}
