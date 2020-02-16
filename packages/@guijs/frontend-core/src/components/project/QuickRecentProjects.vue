<script>
import { useQuery, useResult } from '@vue/apollo-composable'
import { runCommand } from '@/util/command'
import { gql } from '@apollo/client/core'

export default {
  setup () {
    const { result } = useQuery(gql`
      query recentProjectCommands {
        recentProjectCommands {
          id
          label
          description
        }
      }
    `, null, {
      fetchPolicy: 'cache-and-network',
    })
    const recentProjectCommands = useResult(result, [])

    return {
      recentProjectCommands,
      runCommand,
    }
  },
}
</script>

<template>
  <div
    v-if="!recentProjectCommands.length"
    class="text-gray-500"
  >
    No recent projects
  </div>
  <div
    v-else
    class="flex flex-col items-start"
  >
    <VButton
      v-for="command of recentProjectCommands"
      :key="command.id"
      v-tooltip.right="command.description"
      iconLeft="work"
      class="text-secondary-600 mb-2"
      @click="runCommand(command.id)"
    >
      {{ command.label }}
    </VButton>
  </div>
</template>
