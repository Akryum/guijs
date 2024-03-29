const Lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')
const { rcFolder } = require('./rcFolder')
const { log } = require('./logger')

const db = new Lowdb(new FileSync(path.resolve(rcFolder, 'db.json')))

log('Loading DB...', path.resolve(rcFolder, 'db.json'))

// Seed an empty DB
db.defaults({
  projects: [],
  foldersFavorite: [],
  tasks: [],
  config: {},
}).write()

module.exports = {
  db,
}
