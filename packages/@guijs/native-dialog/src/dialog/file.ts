import execa from 'execa'
import { DialogOptions, getZenityArgs } from './dialog-common'
import { mergeOptions } from '../util/merge-options'
import { implement } from '../util/os-implementation'

export interface SelectFileOptions extends DialogOptions {
  cwd?: string
  filename?: string
  multiple?: boolean
  directory?: boolean
  save?: boolean
}

export const DEFAULT_SELECT_FILE_OPTIONS: SelectFileOptions = {
  get cwd () { return process.cwd() },
  multiple: false,
  directory: false,
  save: false,
}

const implementation = implement<(options: SelectFileOptions) => Promise<string[]>>({
  linux: async (options: SelectFileOptions) => {
    const args = [
      '--file-selection',
      '--separator=|',
      ...getZenityArgs(options),
    ]
    if (options.directory) args.push('--directory')
    if (options.save) args.push('--save')
    if (options.multiple) args.push('--multiple')
    if (options.filename) args.push(`--filename=${options.filename}`)
    try {
      const { stdout } = await execa('zenity', args, {
        cwd: options.cwd,
      })
      return stdout.split('|')
    } catch (e) {
      return []
    }
  },
  macos: async (options: SelectFileOptions) => {
    const args = [
      '-e',
    ]
    let appleScript = `set theFiles to choose ${options.directory ? 'folder' : 'file'} ${options.save ? 'name' : ''} `
    if (options.title) {
      appleScript += `with prompt "${options.title}" `
    }
    if (options.multiple) {
      appleScript += `with multiple selections allowed `
    }
    args.push(appleScript)

    try {
      const { stdout } = await execa('osascript', args, {
        cwd: options.cwd,
      })
      return stdout.split(',').map(result => {
        result = result.replace('alias ', '')
        return result.split(':').slice(1).join('/')
      })
    } catch (e) {
      return []
    }
  },
})

export async function selectFile (options: SelectFileOptions = {}) {
  const finalOptions = mergeOptions(options, DEFAULT_SELECT_FILE_OPTIONS)
  if (options.multiple && options.save) {
    throw new Error(`Options multiple and save can't be enabled at the same time.`)
  }
  return implementation()(finalOptions)
}
