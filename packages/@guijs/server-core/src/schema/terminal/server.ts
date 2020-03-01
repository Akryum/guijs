import ws from 'ws'
import http from 'http'
import shortid from 'shortid'
import { CreateTerminalInput } from '@/generated/schema'
import { spawn as spawnPty, IWindowsPtyForkOptions, IPty } from 'node-pty-prebuilt-multiarch'
import defaultShell from 'default-shell'
import { EventEmitter } from 'events'
import consola from 'consola'
import fs from 'fs-extra'
import path from 'path'
import shellEnv from 'shell-env'
import os from 'os'
import projectPackage from '../../../package.json'
import { DataBatcher } from './data-batcher'
import { rcFolder } from '@/util/rc-folder'
import { hook } from '@nodepack/app-context'

const terminalsFolder = path.resolve(rcFolder, 'terminals')

const envPathDelimiter = os.platform() === 'win32' ? ';' : ':'

export interface TerminalOptions {
  name: string
  title: string
  cwd?: string
  hidden?: boolean
}

export class Terminal extends EventEmitter {
  id: string = shortid()
  name: string
  title: string
  cwd: string
  envPath: string[] = []
  hidden: boolean
  running = false
  killed = false
  pty: IPty
  batcher: DataBatcher
  sockets: ws[] = []
  backupFile: string
  backupStream: fs.WriteStream

  constructor (options: TerminalOptions) {
    super()

    this.name = options.name
    this.title = options.title
    this.cwd = options.cwd || process.cwd()
    this.hidden = !!options.hidden

    this.batcher = new DataBatcher()

    this.backupFile = path.resolve(terminalsFolder, `${this.id}.log`)
    fs.ensureFileSync(this.backupFile)
    this.backupStream = fs.createWriteStream(this.backupFile, {
      encoding: 'utf8',
    })

    this.batcher.on('flush', data => {
      for (const socket of this.sockets) {
        send(socket, MESSAGE_TYPE.TerminalDataOut, data)
      }
      this.backupStream.write(data)
      this.emit('data', data)
    })
  }

  run (command: string, args: string[]) {
    if (this.running) {
      consola.warn('Terminal already running')
      return
    }

    this.running = true
    this.killed = false

    // ENV
    const env = getPtyEnv()
    env.PATH = this.envPath.concat(env.PATH).join(envPathDelimiter)

    const ptyOptions: IWindowsPtyForkOptions = {
      cols: 200,
      rows: 30,
      cwd: this.cwd,
      env,
    }

    this.pty = spawnPty(command, args, ptyOptions)

    this.pty.onData(chunk => {
      if (!this.running) {
        return
      }
      this.batcher.write(chunk as any)
    })

    this.pty.onExit((event) => {
      if (this.running) {
        this.running = false
        this.emit('exit', event.exitCode, event.signal)
      }
    })
  }

  runShell () {
    const shell = defaultShell
    const args = ['--login']
    this.run(shell, args)
  }

  write (data: string) {
    this.pty.write(data)
  }

  resize (columns: number, rows: number) {
    try {
      this.pty.resize(columns, rows)
    } catch (err) {
      consola.error(err.stack)
    }
  }

  kill (markAsKilled = false) {
    if (!this.running) return

    this.killed = markAsKilled

    return new Promise((resolve, reject) => {
      try {
        this.pty.on('exit', () => {
          resolve()
        })
        this.pty.kill()
      } catch (e) {
        reject(e)
      }
    })
  }

  async destroy () {
    this.clean()
    await this.kill()
  }

  clean () {
    // Notify sockets
    for (const socket of this.sockets) {
      send(socket, MESSAGE_TYPE.TerminalDestroyed, {})
    }
    // Cleanup backup
    this.backupStream.close()
    if (fs.existsSync(this.backupFile)) {
      fs.removeSync(this.backupFile)
    }
  }

  async readBackup (socket: ws) {
    if (!fs.existsSync(this.backupFile)) return
    // @TODO optimize
    const data = await fs.readFile(this.backupFile, {
      encoding: 'utf8',
    })
    send(socket, MESSAGE_TYPE.TerminalDataOut, data)
  }
}

function getPtyEnv () {
  const osLocale = require('os-locale') as typeof import('os-locale')

  delete process.env.npm_config_prefix

  const env = Object.assign(
    {
      PATH: '',
    },
    process.env,
    shellEnv.sync(),
    {
      LANG: `${osLocale.sync().replace(/-/, '_')}.UTF-8`,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor',
      TERM_PROGRAM: projectPackage.productName,
      TERM_PROGRAM_VERSION: projectPackage.version,
    },
  )

  delete env.PORT
  delete env.NODE_ENV
  delete env.GUIJS_TERMINAL_WS_PORT
  delete env.GUIJS_TEST
  delete env.GUIJS_DEV
  delete env.GUIJS_DB_PATH

  return env
}

export const terminals: Terminal[] = []

export enum MESSAGE_TYPE {
  TerminalAttach = 'terminal-attach',
  TerminalAttached = 'terminal-attached',
  TerminalReady = 'terminal-ready',
  TerminalResize = 'terminal-resize',
  TerminalDataOut = 'terminal-data-out',
  TerminalDataIn = 'terminal-data-in',
  TerminalDestroyed = 'terminal-destroyed',
}

// @TODO WS path https://github.com/apollographql/apollo-server/pull/2314
// export const terminalServer = new ws.Server({ noServer: true })

// hook('apolloSchema', (ctx: Context) => {
//   const { httpServer } = ctx
//   httpServer.on('upgrade', (req, socket, head) => {
//     if (req.url === '/terminal') {
//       terminalServer.handleUpgrade(req, socket, head, function done (ws) {
//         terminalServer.emit('connection', ws, req)
//       })
//     }
//   })
// })

const server = http.createServer()
export const terminalServer = new ws.Server({ server })

hook('expressListen', () => {
  server.listen(process.env.GUIJS_TERMINAL_WS_PORT || 5010)
})

terminalServer.on('error', error => {
  consola.error(error)
})

function send (socket: ws, type: MESSAGE_TYPE, data: any) {
  const rawData = typeof data === 'string' ? data : JSON.stringify(data)
  const message = `${type}:${rawData}`
  socket.send(message)
}

terminalServer.on('connection', socket => {
  const attachedTerminals: Terminal[] = []

  socket.on('error', error => {
    consola.error('socket error', error)
  })

  socket.on('message', message => {
    if (typeof message === 'string') {
      const separatorIndex = message.indexOf(':')
      const type = message.substr(0, separatorIndex)
      const rawData = message.substr(separatorIndex + 1)

      switch (type) {
        case MESSAGE_TYPE.TerminalAttach: {
          const data = JSON.parse(rawData)
          const terminal = terminals.find(t => t.id === data.id)
          if (terminal) {
            terminal.sockets.push(socket)
            attachedTerminals.push(terminal)
            send(socket, MESSAGE_TYPE.TerminalAttached, {})
          }
          break
        }

        case MESSAGE_TYPE.TerminalReady: {
          for (const terminal of attachedTerminals) {
            terminal.readBackup(socket)
          }
          break
        }

        case MESSAGE_TYPE.TerminalResize: {
          const data = JSON.parse(rawData)
          for (const terminal of attachedTerminals) {
            terminal.resize(data.columns, data.rows)
          }
          break
        }

        case MESSAGE_TYPE.TerminalDataIn: {
          for (const terminal of attachedTerminals) {
            terminal.write(rawData)
          }
          break
        }
      }
    }
  })

  socket.on('close', (code, reason) => {
    consola.log('close', code, reason)
    for (const terminal of attachedTerminals) {
      const index = terminal.sockets.indexOf(socket)
      if (index !== -1) {
        terminal.sockets.splice(index, 1)
      }
    }
  })
})

export function createTerminal (
  input: CreateTerminalInput,
) {
  const terminal = new Terminal(input)
  terminals.push(terminal)
  return terminal
}

export async function removeTerminal (
  id: string,
) {
  const index = terminals.findIndex(t => t.id === id)
  if (index !== -1) {
    const terminal = terminals[index]
    await terminal.destroy()
    terminals.splice(index, 1)
    return terminal
  }
  return null
}

export async function cleanTerminals () {
  for (const terminal of terminals) {
    await terminal.destroy()
  }
  terminalServer.close()
}

export async function cleanBackupFiles () {
  fs.ensureDirSync(terminalsFolder)
  const files = await fs.readdir(terminalsFolder)
  for (const file of files) {
    await fs.remove(path.resolve(terminalsFolder, file))
  }
}

cleanBackupFiles()
