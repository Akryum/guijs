import fs from 'fs-extra'
import path from 'path'
import { getRcPath } from '@nodepack/utils'

let folder: string

function ensureFolder () {
  fs.ensureDirSync(folder)
}

if (process.env.GUIJS_TEST) {
  folder = path.resolve(process.cwd(), '../../../live-test')
  // Clean DB
  fs.removeSync(folder)
} else if (process.env.GUIJS_DEV) {
  folder = path.resolve(process.cwd(), '../../../live')
} else {
  // rc folder in user home
  folder = process.env.GUIJS_DB_PATH ||
    getRcPath('.guijs', { xdgFolder: 'guijs' })
  migrateRcFolder()
}

ensureFolder()
export const rcFolder = folder

function migrateRcFolder () {
  // @TODO migrate vue-cli-ui data

  // const oldFolder = process.env.VUE_CLI_UI_DB_PATH ||
  //   getRcPath('.vue-cli-ui', { xdgFolder: 'vue' })

  // if (fs.existsSync(oldFolder) && !fs.existsSync(folder)) {
  //   ensureFolder()
  //   fs.copySync(oldFolder, folder, {
  //     recursive: true,
  //   })
  // }
}

export function getRcFile (filePath: string) {
  const file = path.resolve(rcFolder, filePath)
  fs.ensureDirSync(path.dirname(file))
  return file
}

export function getRcDir (dirPath: string) {
  const dir = path.resolve(rcFolder, dirPath)
  fs.ensureDirSync(dir)
  return dir
}
