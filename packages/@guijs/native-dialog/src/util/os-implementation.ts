import { platform } from 'os'

export interface Implementations<T = Function> {
  windows?: T
  macos?: T
  linux?: T
}

export const osMap: Partial<{ [key in NodeJS.Platform]: keyof Implementations }> = {
  'win32': 'windows',
  'darwin': 'macos',
  'linux': 'linux',
}

export function implement<T = Implementations> (implementations: Implementations<T>): T {
  const currentPlatform = platform()
  const fn = implementations[osMap[currentPlatform]]

  if (!fn) {
    throw new Error(`Not implemented for platform ${currentPlatform}`)
  }

  return fn
}
