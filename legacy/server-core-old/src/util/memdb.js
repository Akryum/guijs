const Lowdb = require('lowdb')
const Memory = require('lowdb/adapters/Memory')

const memdb = new Lowdb(new Memory())

// Seed an empty DB
memdb.defaults({
  openProjects: [],
}).write()

module.exports = {
  memdb,
}
