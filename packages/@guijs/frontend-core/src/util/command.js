import { onUnmounted, onActivated } from '@vue/composition-api'
import { apolloClient } from '@/apollo'
import { gql } from '@apollo/client/core'

const handlers = {}
const anyHandlers = []

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
    if (lastCommand && lastCommand.id === id) {
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

export function onAnyCommand (handler) {
  const add = () => {
    anyHandlers.push(handler)
  }

  const remove = () => {
    const index = anyHandlers.indexOf(handler)
    if (index !== -1) anyHandlers.splice(index, 1)
  }

  add()
  onActivated(() => add())
  onUnmounted(() => remove())
}

export function dispatchCommand (command, payload) {
  getHandlers(command.id).forEach(handler => handler(command, payload))
  anyHandlers.forEach(handler => handler(command, payload))
  lastCommand = command
}

export function runCommand (id, payload = null) {
  return apolloClient.mutate({
    mutation: gql`
    mutation runCommand ($input: RunCommandInput!) {
      runCommand (input: $input) {
        id
      }
    }
  `,
    variables: {
      input: {
        id,
        payload,
      },
    },
  })
}
