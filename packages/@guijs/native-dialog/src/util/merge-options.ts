// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Options = { [key: string]: any }

export function mergeOptions (options: Options, defaultOptions: Options) {
  const result = {
    ...options,
  }
  for (const key in defaultOptions) {
    if (typeof result[key] === 'undefined') {
      result[key] = defaultOptions[key]
    }
  }
  return result
}
