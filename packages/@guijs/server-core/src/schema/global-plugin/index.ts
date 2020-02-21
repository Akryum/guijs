import path from 'path'
import fs from 'fs-extra'
import { rcFolder } from '@/util/rc-folder'
import { resolveModule } from '@nodepack/module'
import { installPackage } from '@nodepack/utils'
import clearModule from 'clear-module'

export const pluginFolder = path.join(rcFolder, 'global-plugins')
fs.ensureDirSync(pluginFolder)

export function isPluginInstalled (id: string) {
  clearModule(id)
  return !!resolveModule(path.join(id, 'package.json'), pluginFolder)
}

export async function installPlugin (id: string) {
  clearModule(id)
  await installPackage(pluginFolder, 'npm', null, id, false)
}
