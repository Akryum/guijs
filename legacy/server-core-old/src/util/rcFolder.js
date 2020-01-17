const fs = require('fs-extra')
const path = require('path')

const { getRcPath } = require('@nodepack/utils')
const { log } = require('./logger')

let folder

if (process.env.GUIJS_TEST) {
  folder = path.resolve(process.cwd(), '../../../live-test')
  // Clean DB
  fs.removeSync(folder)
} else if (process.env.GUIJS_DEV) {
  folder = path.resolve(process.cwd(), '../../../live')
} else {
  folder = process.env.GUIJS_DB_PATH ||
    getRcPath('.guijs', { xdgFolder: 'guijs' })
  migrateRcFolder()
}

ensureFolder()
exports.rcFolder = folder

function ensureFolder () {
  fs.ensureDirSync(folder)
}

function migrateRcFolder () {
  const oldFolder = process.env.VUE_CLI_UI_DB_PATH ||
    getRcPath('.vue-cli-ui', { xdgFolder: 'vue' })

  if (fs.existsSync(oldFolder) && !fs.existsSync(folder)) {
    log(`Migrating config folder from ${oldFolder} to ${folder}...`)
    ensureFolder()
    fs.copySync(oldFolder, folder, {
      recursive: true,
    })
  }
}
