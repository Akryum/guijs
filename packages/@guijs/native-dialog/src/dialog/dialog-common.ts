export interface DialogOptions {
  title?: string
}

export function getZenityArgs (options: DialogOptions) {
  const args = []
  if (options.title) args.push(`--title=${options.title}`)
  return args
}
