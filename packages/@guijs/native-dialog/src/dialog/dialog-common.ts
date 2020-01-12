import { escapeArg } from '../util/escape'

export interface DialogOptions {
  title?: string
}

export function getZenityArgs (options: DialogOptions) {
  const args = []
  if (options.title) args.push(`--title=${escapeArg(options.title)}`)
  return args
}
