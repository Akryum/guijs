<script>
import { ref, computed, watch } from '@vue/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { bindScope, onKey } from '@/util/keybinding'
import { onCommand, runCommand } from '@/util/command'
import { getSearchType, TYPE_WORDS } from './util'
import { ICONS } from './icons'
import FindItem from './FindItem.vue'

export default {
  components: {
    FindItem,
  },

  setup () {
    // Open

    const isOpen = ref(false)
    let keepOpen = false

    watch(isOpen, value => {
      if (!value) {
        keepOpen = false
      }
    })

    bindScope('find-modal', isOpen)
    onKey('esc', () => {
      isOpen.value = false
    }, {
      scope: 'find-modal',
      global: true,
    })

    // Search

    const searchText = ref('')
    const input = ref()
    // Reset text on close
    watch(isOpen, value => {
      if (!value) searchText.value = ''
    })

    const searchType = computed(() => getSearchType(searchText.value))
    const searchIcon = computed(() => {
      if (searchType.value) {
        return ICONS[searchType.value]
      }
      return 'search'
    })

    const { result } = useQuery(gql`
      query searchCommands ($text: String!) {
        searchCommands (text: $text) {
          id
          type
          label
          icon
          description
          keybinding {
            id
            sequences
          }
        }
      }
    `, () => ({
      text: searchText.value,
    }), {
      fetchPolicy: 'no-cache',
    })
    const commands = useResult(result, [])

    async function selectCommand (id) {
      const { data } = await runCommand(id)
      if (data.runCommand) {
        if (keepOpen) {
          keepOpen = false
        } else {
          isOpen.value = false
        }
      }
    }

    // Keyboard navigation

    const selectedIndex = ref(0)
    watch(commands, () => {
      selectedIndex.value = 0
    })

    onKey('enter', () => {
      const command = commands.value[selectedIndex.value]
      if (command) {
        selectCommand(command.id)
      }
    }, {
      scope: 'find-modal',
      global: true,
    })

    onKey('up', () => {
      selectedIndex.value--
      if (selectedIndex.value < 0) {
        selectedIndex.value = 0
      }
    }, {
      scope: 'find-modal',
      global: true,
    })

    onKey('down', () => {
      selectedIndex.value++
      if (selectedIndex.value > commands.value.length - 1) {
        selectedIndex.value = commands.value.length - 1
      }
    }, {
      scope: 'find-modal',
      global: true,
    })

    // Commands
    for (const word of Object.keys(TYPE_WORDS)) {
      if (word === '?') continue
      onCommand(word, () => {
        keepOpen = true
        isOpen.value = true
        searchText.value = word
        input.value.focus()
      })
    }

    onCommand('find', () => {
      isOpen.value = !isOpen.value
    })

    onCommand('command', () => {
      keepOpen = true
      isOpen.value = true
      searchText.value = '>'
    })

    onCommand('find-projects', () => {
      keepOpen = true
      isOpen.value = true
      searchText.value = '<'
    })

    return {
      isOpen,
      searchText,
      searchType,
      searchIcon,
      input,
      commands,
      selectCommand,
      selectedIndex,
    }
  },
}
</script>

<template>
  <VModal
    v-if="isOpen"
    @close="isOpen = false"
  >
    <template #title>
      <VInput
        ref="input"
        v-model="searchText"
        placeholder="Type '?' to get help"
        auto-focus
        class="px-4 border-gray-200 border-r h-full"
      >
        <template #before>
          <i class="material-icons text-2xl text-gray-500 ml-2 mr-4">
            {{ searchIcon }}
          </i>
        </template>
      </VInput>
    </template>

    <div class="flex flex-col max-h-128 overflow-x-auto">
      <FindItem
        v-for="(command, index) of commands"
        :key="command.id"
        :command="command"
        :selected="selectedIndex === index"
        @select="selectCommand(command.id)"
        @mouseover.native="selectedIndex = index"
      />
    </div>

    <VEmpty v-if="!commands.length">
      No results found
    </VEmpty>
  </VModal>
</template>