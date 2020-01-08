import { onCreate, addProp } from '@nodepack/app-context'
import Datastore from 'nedb'
import path from 'path'
import { rcFolder } from '@/util/rc-folder'

onCreate(context => {
  addProp(context, 'db', () => new Datastore({
    filename: path.resolve(rcFolder, 'main.db'),
    autoload: true,
  }))
})

export default interface DbContext {
  db: Datastore
}
