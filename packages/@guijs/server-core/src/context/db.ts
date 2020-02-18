import { onCreate } from '@nodepack/app-context'
import Datastore from 'nedb-promise'
import path from 'path'
import fs from 'fs-extra'
import { rcFolder } from '@/util/rc-folder'
import { ThenType } from '@/util/types'

async function collection (name: string, indexes: string[] = [], clear = false): Promise<Datastore> {
  const dbPath = path.resolve(rcFolder, `db/${name}.db`)
  if (!fs.existsSync(dbPath)) {
    fs.ensureDirSync(path.dirname(dbPath))
    fs.writeFileSync(dbPath, '')
  }
  const ds = new Datastore({
    filename: dbPath,
    autoload: true,
    timestampData: true,
  })

  if (clear) {
    await ds.remove({}, { multi: true })
  }

  for (const index of indexes) {
    await ds.ensureIndex({ fieldName: index })
  }

  return ds
}

async function createCollections () {
  return {
    projects: await collection('projects'),
    packages: await collection('packages', [
      'name',
    ]),
    scripts: await collection('scripts', [
      'name',
      'projectId',
      'workspaceId',
    ], false),
  }
}

let collections: ThenType<typeof createCollections>

onCreate(async context => {
  if (!collections) {
    collections = await createCollections()
  }
  context.db = collections
})

export default interface DbContext {
  db: ThenType<typeof createCollections>
}
