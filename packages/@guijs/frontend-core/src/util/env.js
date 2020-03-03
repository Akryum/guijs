export const isWindows = /win32/i.test(navigator.platform)

export const pathDelimiter = isWindows ? '\\' : '/'
