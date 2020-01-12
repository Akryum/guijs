import { platform } from 'os'

export interface Implementation<T = Function> {
  windows?: T
  macos?: T
  linux?: T
}

export const osMap: Partial<{ [key in NodeJS.Platform]: keyof Implementation }> = {
  'win32': 'windows',
  'darwin': 'macos',
  'linux': 'linux',
}

export function implement<T = Implementation> (implementation: Implementation<T>): T {
  const currentPlatform = platform()
  const fn = implementation[osMap[currentPlatform]]

  if (!fn) {
    throw new Error(`Not implemented for platform ${currentPlatform}`)
  }

  return fn
}
