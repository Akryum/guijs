import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { taskFragment } from './fragments'
import { watch, computed, isRef, ref } from '@vue/composition-api'

export function useTask (id = null) {
  if (typeof id === 'function') {
    id = computed(id)
  } else if (!isRef(id)) {
    id = ref(id)
  }

  const { result } = useQuery(gql`
    query task ($id: ID!) {
      task (id: $id) {
        ...task
      }
    }
    ${taskFragment}
  `, () => ({
    id: id.value,
  }), () => ({
    enabled: !!id.value,
  }))

  const task = useResult(result, null)

  // Status

  const running = computed(() => task.value && task.value.status === 'running')
  const success = computed(() => task.value && task.value.status === 'success')
  const error = computed(() => task.value && task.value.status === 'error')

  const onSuccessHandlers = []

  function onSuccess (handler) {
    onSuccessHandlers.push(handler)
  }

  const onErrorHandlers = []

  function onError (handler) {
    onErrorHandlers.push(handler)
  }

  watch(task, value => {
    if (value) {
      if (value.status === 'success') {
        onSuccessHandlers.forEach(h => h())
      } else if (value.status === 'error') {
        onErrorHandlers.forEach(h => h(value.message))
      }
    }
  })

  return {
    id,
    task,
    running,
    success,
    error,
    onSuccess,
    onError,
  }
}
