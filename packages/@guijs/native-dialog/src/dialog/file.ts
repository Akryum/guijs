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

const implementation = implement({
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
})

export async function selectFile (options: SelectFileOptions = {}) {
  const finalOptions = mergeOptions(options, DEFAULT_SELECT_FILE_OPTIONS)
  return implementation(finalOptions)
}
