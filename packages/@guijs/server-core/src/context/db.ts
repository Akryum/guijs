import { onCreate, addProp } from '@nodepack/app-context'
import Datastore from 'nedb-promise'
import path from 'path'
import { rcFolder } from '@/util/rc-folder'

function collection (name: string): Datastore {
  return new Datastore({
    filename: path.resolve(rcFolder, `db/${name}.db`),
    autoload: true,
    timestampData: true,
  })
}

function createCollections () {
  return {
    projects: collection('projects'),
  }
}

onCreate(context => {
  addProp(context, 'db', () => createCollections())
})

export default interface DbContext {
  db: ReturnType<typeof createCollections>
}
