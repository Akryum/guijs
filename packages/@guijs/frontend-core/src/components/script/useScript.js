import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { useRoute } from '@/util/router'
import { scriptFragment } from './fragments'
import { terminalFragment } from '../terminal/fragments'

export function useScriptQuery (query) {
  const route = useRoute()

  const { result, loading } = useQuery(query, () => ({
    scriptId: route.value.params.scriptId,
  }), () => ({
    enabled: !!route.value.params.scriptId,
  }))
  const script = useResult(result)

  return {
    script,
    loading,
  }
}

export function useScriptRun () {
  // Run

  const { mutate: runMutate } = useMutation(gql`
    mutation runScript ($input: RunScriptInput!) {
      runScript (input: $input) {
        ...script
        terminal {
          ...terminal
        }
      }
    }
    ${scriptFragment}
    ${terminalFragment}
  `)

  function runScript (scriptId) {
    return runMutate({ input: { scriptId } })
  }

  // Stop

  const { mutate: stopMutate } = useMutation(gql`
    mutation stopScript ($input: StopScriptInput!) {
      stopScript (input: $input) {
        ...script
      }
    }
    ${scriptFragment}
  `)

  function stopScript (scriptId) {
    return stopMutate({ input: { scriptId } })
  }

  return {
    runScript,
    stopScript,
  }
}
