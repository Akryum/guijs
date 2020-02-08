import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { scriptFragment } from './fragments'
import { terminalFragment } from '../terminal/fragments'

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
