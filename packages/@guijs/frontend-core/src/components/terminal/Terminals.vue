<script>
import { ref, watch } from '@vue/composition-api'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'
import { onKeybind, bindScope } from '@/util/keybinding'
import { onCommand, runCommand } from '@/util/command'
import { terminalFragment } from './fragments'
import Terminal from './Terminal.vue'

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
    const el = ref(null)

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

    function newTerminal () {
      return createTerminal({
        input: {
          name: '~',
          title: '',
          hidden: false,
        },
      })
    }

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
      if (terminals.value.length) {
        currentTerminalId.value = terminals.value[terminals.value.length - 1].id
      }
    })

    // Close terminals

    function closeTerminals () {
      runCommand('toggle-terminals')
    }

    // Keybindings
    bindScope('terminals', el)
    onCommand('new-terminal', () => {
      newTerminal()
    })
    onKeybind('close-terminal', () => {
      removeTerminal({ id: currentTerminalId.value })
    })

    return {
      el,
      terminals,
      loading,
      currentTerminalId,
      newTerminal,
      removeTerminal,
      closeTerminals,
    }
  },
}
</script>

<template>
  <div
    v-if="!loading"
    ref="el"
    tabindex="0"
    class="h-full flex flex-col overflow-hidden"
  >
    <!-- Tabs -->
    <div class="flex border-gray-200 border-b dark:border-gray-950">
      <div class="flex flex-1">
        <VButton
          v-for="terminal of terminals"
          :key="terminal.id"
          square
          class="tab group flex items-center relative px-4 py-2 text-sm max-w-48 border-gray-200 border-r hover:bg-primary-100 dark:border-gray-950 dark-hover:bg-primary-800 dark-hover:text-primary-300"
          :class="{
            'text-primary-500': currentTerminalId === terminal.id,
          }"
          @click.native.middle="removeTerminal({ id: terminal.id })"
          @click.native.left="currentTerminalId = terminal.id"
        >
          <div
            v-tooltip="`${terminal.name} ${terminal.title}`"
            class="flex-1 truncate"
          >
            {{ terminal.name }}
            {{ terminal.title }}
          </div>

          <!-- Close -->
          <VButton
            v-tooltip="$t('guijs.terminals.close-terminal')"
            iconLeft="close"
            class="ml-1 invisible group-hover:visible text-primary-300 hover:text-primary-600 hover:bg-primary-200 dark-hover:text-primary-400 dark-hover:bg-primary-900"
            stop
            @click="removeTerminal({ id: terminal.id })"
          />

          <!-- Selected border -->
          <div
            v-if="currentTerminalId === terminal.id"
            class="selected-border absolute left-0 right-0 border-primary-300 dark:border-primary-600 border-b"
          />
        </VButton>
      </div>

      <VButton
        v-tooltip="$t('guijs.terminals.new-terminal')"
        iconLeft="add"
        square
        class="px-3 py-3 hover:bg-primary-100 dark-hover:bg-primary-800"
        @click="newTerminal()"
      />

      <VButton
        v-tooltip="$t('guijs.terminals.close-terminal-pane')"
        iconLeft="close"
        square
        class="px-3 py-3 hover:bg-primary-100 dark-hover:bg-primary-800"
        @click="closeTerminals()"
      />
    </div>

    <!-- Terminal display -->
    <keep-alive>
      <template v-for="terminal of terminals">
        <Terminal
          v-if="currentTerminalId === terminal.id"
          :key="terminal.id"
          :terminalId="terminal.id"
          :cwd="terminal.cwd"
          class="flex-1"
        />
      </template>
    </keep-alive>

    <VEmpty
      v-if="!terminals.length"
      icon="laptop"
      class="h-full"
    >
      <div>{{ $t('guijs.terminals.no-terminal') }}</div>

      <a
        class="text-secondary-500 hover:text-secondary-400 cursor-pointer"
        @click="newTerminal()"
      >
        {{ $t('guijs.terminals.new-terminal') }}
      </a>
    </VEmpty>
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
