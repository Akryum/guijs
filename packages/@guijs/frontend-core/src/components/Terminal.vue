<script>
import { ref, onMounted, watch, onUnmounted, onActivated } from '@vue/composition-api'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { SearchAddon } from 'xterm-addon-search'
import { WebLinksAddon } from 'xterm-addon-web-links'
import { WebglAddon } from 'xterm-addon-webgl'
import { onWindowEvent } from '@/util/window'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const isWindows = ['Windows', 'Win16', 'Win32', 'WinCE'].includes(navigator.platform)

const terminalCache = {}

const defaultTheme = {
  foreground: '#2c3e50',
  background: '#fff',
  cursor: '#ccc',
  cursorAccent: '#ddd',
  selection: '#ccc',
  black: '#000000',
  red: '#e83030',
  brightRed: '#e83030',
  green: '#42b983',
  brightGreen: '#42b983',
  brightYellow: '#ea6e00',
  yellow: '#ea6e00',
  magenta: '#e83030',
  brightMagenta: '#e83030',
  cyan: '#03c2e6',
  brightBlue: '#03c2e6',
  brightCyan: '#03c2e6',
  blue: '#03c2e6',
  white: '#d0d0d0',
  brightBlack: '#808080',
  brightWhite: '#ffffff',
}

// const darkTheme = {
//   ...defaultTheme,
//   foreground: '#fff',
//   background: '#1d2935',
//   cursor: 'rgba(255, 255, 255, .4)',
//   selection: 'rgba(255, 255, 255, 0.3)',
//   magenta: '#e83030',
//   brightMagenta: '#e83030',
// }

export default {
  props: {
    terminalId: {
      type: String,
      required: true,
    },

    cwd: {
      type: String,
      default: null,
    },
  },

  setup (props) {
    // Cache
    let cached = terminalCache[props.terminalId]
    if (!cached) {
      cached = terminalCache[props.terminalId] = {
        ws: null,
        attached: false,
        term: null,
        listeners: [],
        fitAddon: new FitAddon(),
        searchAddon: new SearchAddon(),
        scroll: 0,
      }
    }

    let listeners = cached.listeners
    let disposableListeners = []

    // Web socket

    /** @type {WebSocket} */
    let ws = cached.ws

    function send (type, data) {
      ws.send(`${type}:${typeof data === 'string' ? data : JSON.stringify(data)}`)
    }

    function on (type, handler) {
      const listener = event => {
        if (typeof event.data === 'string') {
          const separatorIndex = event.data.indexOf(':')
          const messageType = event.data.substr(0, separatorIndex)
          const rawData = event.data.substr(separatorIndex + 1)
          if (messageType === type) {
            handler(rawData)
          }
        }
      }
      ws.addEventListener('message', listener)
      return () => {
        ws.removeEventListener('message', listener)
      }
    }

    const attached = ref(cached.attached)

    if (!ws) {
      ws = cached.ws = new WebSocket(`ws://localhost:${process.env.VUE_APP_TERMINAL_WS_PORT}`)

      // Attach to terminal

      listeners.push(on('terminal-attached', () => {
        attached.value = true
      }))

      const onOpen = () => {
        send('terminal-attach', { id: props.terminalId })
      }
      ws.addEventListener('open', onOpen)
      listeners.push(() => ws.removeEventListener('open', onOpen))
    }

    // Change title
    const { mutate: changeTitle } = useMutation(gql`
      mutation changeTerminalTitle ($input: ChangeTerminalTitleInput!) {
        changeTerminalTitle (input: $input) {
          id
          title
        }
      }
    `)

    // XTerminal

    const fitAddon = cached.fitAddon
    const searchAddon = cached.searchAddon

    /** @type {Terminal} */
    let term = cached.term

    const xtermTarget = ref(null)

    function createTerminal () {
      if (!term) {
        term = new Terminal({
          theme: defaultTheme,
          scrollback: 10000,
          windowsMode: isWindows,
          macOptionIsMeta: true,
        })
        terminalCache[props.terminalId] = term

        // Addons

        term.loadAddon(fitAddon)
        term.loadAddon(searchAddon)
        term.loadAddon(new WebLinksAddon())

        term.open(xtermTarget.value)

        term.loadAddon(new WebglAddon())

        // Data

        listeners.push(on('terminal-data-out', data => {
          term.write(data)
        }))

        listeners.push(term.onData(data => {
          write(data)
        }))

        // Resize
        listeners.push(term.onResize(({ cols, rows }) => {
          onResize(cols, rows)
        }))

        // Scroll
        listeners.push(term.onScroll(position => {
          cached.scroll = position
        }))

        // Title
        disposableListeners.push(term.onTitleChange(async title => {
          await changeTitle({
            input: {
              id: props.terminalId,
              title,
            },
          })
        }))
      }

      // Init
      fitAddon.fit()
      term.focus()
      // Initial size is undefined on the server
      onResize(term.cols, term.rows)

      term.setOption('cursorBlink', true)
      // https://github.com/xtermjs/xterm.js/issues/291
      // term.scrollToLine(cached.scroll)
      term._core._onScroll.fire(cached.scroll)
    }

    let mounted = false
    onMounted(() => {
      mounted = true
      if (attached.value) {
        createTerminal()
      }
    })

    onActivated(() => {
      if (attached.value) {
        createTerminal()
      }
    })

    watch(attached, value => {
      cached.attached = value
      if (value && mounted) {
        createTerminal()
      }
    })

    onUnmounted(() => {
      for (const off of disposableListeners) {
        off.dispose ? off.dispose() : off()
      }
      disposableListeners = []
    })

    function onResize (columns, rows) {
      send('terminal-resize', { columns, rows })
    }

    // Terminal utils

    function write (data) {
      send('terminal-data-in', data)
    }

    function clear () {
      term.clear()
    }

    function destroy () {
      for (const off of listeners) {
        off.dispose ? off.dispose() : off()
      }
      listeners = []
      term.dispose()
      term = null
      delete terminalCache[props.terminalId]
    }

    listeners.push(on('terminal-destroyed', destroy))

    // Paste
    onWindowEvent('paste', event => {
      if (term) {
        const data = (event.clipboardData || window.clipboardData).getData('text')
        console.log('paste', data)
        event.preventDefault()
        event.stopPropagation()
        term._core.handler(data)
      }
    }, {
      capture: true,
    })

    // Screen resize
    onWindowEvent('resize', () => {
      if (term) {
        fitAddon.fit()
      }
    })

    return {
      xtermTarget,
      clear,
    }
  },
}
</script>

<template>
  <div class="p-4">
    <div
      ref="xtermTarget"
      class="w-full h-full"
    />
  </div>
</template>

<style lang="postcss">
@import "~xterm/css/xterm.css";
</style>
