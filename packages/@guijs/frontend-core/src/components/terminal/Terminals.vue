<script>
import { ref, watch } from '@vue/composition-api'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import Terminal from './Terminal.vue'
import gql from 'graphql-tag'

const terminalFragment = gql`
fragment terminal on Terminal {
  id
  name
  title
  cwd
}
`

const TERMINALS = gql`
  query terminals {
    terminals {
      ...terminal
    }
  }
  ${terminalFragment}
`

const STORAGE_CURRENT_TERMINAL_ID = 'dev.guijs.current-terminal-id'

export default {
  components: {
    Terminal,
  },

  setup () {
    const { result, loading } = useQuery(TERMINALS)
    const terminals = useResult(result, [])

    const currentTerminalId = ref(localStorage.getItem(STORAGE_CURRENT_TERMINAL_ID))
    watch(currentTerminalId, value => {
      localStorage.setItem(STORAGE_CURRENT_TERMINAL_ID, value)
    })

    // Create

    const { mutate: createTerminal, onDone: onTerminalCreated } = useMutation(gql`
      mutation createTerminal ($input: CreateTerminalInput!) {
        createTerminal (input: $input) {
          ...terminal
        }
      }
      ${terminalFragment}
    `, {
      update: (cache, { data: { createTerminal } }) => {
        const data = cache.readQuery({ query: TERMINALS })
        data.terminals.push(createTerminal)
        cache.writeQuery({ query: TERMINALS, data })
      },
    })

    onTerminalCreated(result => {
      currentTerminalId.value = result.data.createTerminal.id
    })

    // Remove

    const { mutate: removeTerminal, onDone: onTerminalRemoved } = useMutation(gql`
      mutation removeTerminal ($id: ID!) {
        removeTerminal (id: $id) {
          id
        }
      }
    `, {
      update: (cache, { data: { removeTerminal } }) => {
        if (!removeTerminal) return
        const data = cache.readQuery({ query: TERMINALS })
        const index = data.terminals.findIndex(t => t.id === removeTerminal.id)
        if (index !== -1) data.terminals.splice(index, 1)
        cache.writeQuery({ query: TERMINALS, data })
      },
    })

    onTerminalRemoved(() => {
      // @TODO Select other terminal
    })

    return {
      terminals,
      loading,
      currentTerminalId,
      createTerminal,
      removeTerminal,
    }
  },
}
</script>

<template>
  <div
    v-if="!loading"
    class="h-full flex flex-col overflow-hidden"
  >
    <!-- Tabs -->
    <div class="flex border-gray-200 border-b">
      <div class="flex flex-1">
        <VButton
          v-for="terminal of terminals"
          :key="terminal.id"
          square
          class="tab group flex items-center relative px-4 py-2 text-sm max-w-48 border-gray-200 border-r hover:bg-primary-100"
          :class="{
            'text-primary-500': currentTerminalId === terminal.id,
          }"
          @click.native.middle="removeTerminal({ id: terminal.id })"
          @click.native.left="currentTerminalId = terminal.id"
        >
          <div
            v-tooltip="`${terminal.name} ${terminal.title}`"
            class="flex-1 truncate mr-4"
          >
            {{ terminal.name }}
            {{ terminal.title }}
          </div>

          <VButton
            icon-left="close"
            class="opacity-0 group-hover:opacity-100 hover:text-primary-600 hover:bg-primary-200"
            stop
            @click="removeTerminal({ id: terminal.id })"
          />

          <!-- Selected border -->
          <div
            v-if="currentTerminalId === terminal.id"
            class="selected-border absolute left-0 right-0 border-primary-300 border-b"
          />
        </VButton>
      </div>

      <VButton
        icon-left="add"
        square
        class="px-3 py-3 hover:bg-primary-100"
        @click="createTerminal({
          input: {
            name: '~',
            title: '',
            hidden: false,
          },
        })"
      />
    </div>

    <!-- Terminal display -->
    <keep-alive>
      <template v-for="terminal of terminals">
        <Terminal
          v-if="currentTerminalId === terminal.id"
          :key="terminal.id"
          :terminal-id="terminal.id"
          :cwd="terminal.cwd"
          class="flex-1"
        />
      </template>
    </keep-alive>
  </div>
</template>

<style lang="postcss" scoped>
.tab {
  flex: auto 1 1;
  width: 0;
}

.selected-border {
  bottom: -1px;
}
</style>