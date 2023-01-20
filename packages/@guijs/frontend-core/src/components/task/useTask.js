import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { watch, computed, isRef, ref } from 'vue'
import { taskFragment } from './fragments'

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

  const task = computed(() => result.value?.task)

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
        onSuccessHandlers.forEach(h => h(value))
      } else if (value.status === 'error') {
        onErrorHandlers.forEach(h => h(value, value.message))
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
