import path from 'path'
import fs from 'fs-extra'
import { rcFolder } from '@/util/rc-folder'
import { installPackage } from '@nodepack/utils'
import resolve from 'resolve'

export const pluginFolder = path.join(rcFolder, 'global-plugins')
fs.ensureDirSync(pluginFolder)

export function isPluginInstalled (id: string) {
  try {
    return !!resolve.sync(id, { basedir: pluginFolder })
  } catch (e) {
    return false
  }
}

export async function installPlugin (id: string) {
  await installPackage(pluginFolder, 'npm', null, id, false)
}
