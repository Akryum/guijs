const fs = require('fs')
const path = require('path')
// Connectors
const cwd = require('./cwd')
const folders = require('./folders')
const progress = require('./progress')
const logs = require('./logs')
// Context
// const getContext = require('../context')
// Utils
const { isPlugin } = require('@vue/cli-shared-utils')
const { resolveModule } = require('@nodepack/module')
const {
  getPackageVersionsInfo,
  getPackageMetadata,
  installPackage,
  uninstallPackage,
  updatePackage,
} = require('@nodepack/utils')
const { getCommand } = require('../util/command')
const { resolveModuleRoot } = require('../util/resolve-path')
const { notify } = require('../util/notification')
const { log } = require('../util/logger')

const PROGRESS_ID = 'dependency-installation'
const CLI_SERVICE = '@vue/cli-service'

// Local
let dependencies

function list (file, context) {
  const pkg = folders.readPackage(file, context)
  dependencies = []
  dependencies = dependencies.concat(
    findDependencies(pkg.devDependencies || {}, 'devDependencies', file, context)
  )
  dependencies = dependencies.concat(
    findDependencies(pkg.dependencies || {}, 'dependencies', file, context)
  )
  return dependencies
}

function findOne (id, context) {
  return dependencies.find(
    p => p.id === id
  )
}

function findDependencies (deps, type, file, context) {
  return Object.keys(deps).filter(
    id => !isPlugin(id) && id !== CLI_SERVICE
  ).map(
    id => ({
      id,
      versionRange: deps[id],
      installed: isInstalled({ id, file }),
      website: getLink({ id, file }, context),
      type,
      baseFir: file,
    })
  )
}

function getPath ({ id, file = cwd.get() }) {
  const filePath = resolveModule(path.join(id, 'package.json'), file)
  if (!filePath) return
  return resolveModuleRoot(filePath, id)
}

function isInstalled ({ id, file = cwd.get() }) {
  const resolvedPath = getPath({ id, file })
  return resolvedPath && fs.existsSync(resolvedPath)
}

function readPackage ({ id, file }, context) {
  try {
    return folders.readPackage(getPath({ id, file }), context)
  } catch (e) {
    console.log(e)
  }
  return {}
}

function invalidatePackage ({ id, file }, context) {
  return folders.invalidatePackage(getPath({ id, file }), context)
}

async function getVersion ({ id, installed, versionRange, baseDir }, context) {
  if (id === 'vuedesk-build-bundle') {
    const pkg = folders.readPackage(baseDir, context)
    return {
      current: pkg.vuedesk.version,
      latest: null, // @TODO
      wanted: pkg.vuedesk.version,
      range: pkg.vuedesk.version,
      localPath: null,
    }
  }

  let current
  let latest
  let wanted

  // Is local dep
  const localPath = getLocalPath(id, context)

  try {
    const versionInfo = await getPackageVersionsInfo(baseDir, id, versionRange)
    current = versionInfo.current
    latest = versionInfo.latest
    wanted = versionInfo.wanted
  } catch (e) {
    log(e.message)
  }

  // Read module package.json
  if (installed) {
    const pkg = readPackage({ id, file: baseDir }, context)
    current = pkg.version
  }

  if (!latest) latest = current
  if (!wanted) wanted = current

  return {
    current,
    latest,
    wanted,
    range: versionRange,
    localPath,
  }
}

function getLocalPath (id, context) {
  const projects = require('./projects')
  const projectPkg = folders.readPackage(projects.getCurrent(context).path, context, true)
  const deps = Object.assign(
    {},
    projectPkg.dependencies || {},
    projectPkg.devDependencies || {}
  )
  const range = deps[id]
  if (range && range.match(/^file:/)) {
    const localPath = range.substr('file:'.length)
    return path.resolve(cwd.get(), localPath)
  }
  return null
}

async function getDescription ({ id }, context) {
  const metadata = await getPackageMetadata(id)
  if (metadata) {
    return metadata.description
  }
  return null
}

function getLink ({ id, file }, context) {
  const pkg = readPackage({ id, file }, context)
  return pkg.homepage ||
    (pkg.repository && pkg.repository.url) ||
    `https://www.npmjs.com/package/${id.replace(`/`, `%2F`)}`
}

function install ({ id, type, range }, context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    setProgress({
      status: 'dependency-install',
      args: [id],
    })

    let packageName
    if (range) {
      packageName = `${id}@${range}`
    } else {
      packageName = id
    }

    await installPackage(cwd.get(), getCommand(cwd.get()), null, packageName, type === 'devDependencies')

    logs.add({
      message: `Dependency ${id} installed`,
      type: 'info',
    }, context)

    notify({
      title: `Dependency installed`,
      message: `Dependency ${id} successfully installed`,
      icon: 'done',
    })

    list(cwd.get(), context)

    return findOne(id, context)
  })
}

function uninstall ({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    setProgress({
      status: 'dependency-uninstall',
      args: [id],
    })

    const dep = findOne(id, context)

    await uninstallPackage(cwd.get(), getCommand(cwd.get()), null, id)

    logs.add({
      message: `Dependency ${id} uninstalled`,
      type: 'info',
    }, context)

    notify({
      title: `Dependency uninstalled`,
      message: `Dependency ${id} successfully uninstalled`,
      icon: 'done',
    })

    return dep
  })
}

function update ({ id }, context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    setProgress({
      status: 'dependency-update',
      args: [id],
    })

    const dep = findOne(id, context)
    const { current, wanted } = await getVersion(dep, context)
    await updatePackage(cwd.get(), getCommand(cwd.get()), null, id)

    logs.add({
      message: `Dependency ${id} updated from ${current} to ${wanted}`,
      type: 'info',
    }, context)

    notify({
      title: `Dependency updated`,
      message: `Dependency ${id} was successfully updated`,
      icon: 'done',
    })

    invalidatePackage({ id }, context)

    return findOne(id)
  })
}

function updateAll (context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    const deps = list(cwd.get(), context)
    const updatedDeps = []
    for (const dep of deps) {
      const version = await getVersion(dep, context)
      if (version.current !== version.wanted) {
        updatedDeps.push(dep)
        invalidatePackage({ id: dep.id }, context)
      }
    }

    if (!updatedDeps.length) {
      notify({
        title: `No updates available`,
        message: `No dependency to update in the version ranges declared in package.json`,
        icon: 'done',
      })
      return []
    }

    setProgress({
      status: 'dependencies-update',
      args: [updatedDeps.length],
    })

    await updatePackage(cwd.get(), getCommand(cwd.get()), null, updatedDeps.map(
      p => p.id
    ).join(' '))

    notify({
      title: `Dependencies updated`,
      message: `${updatedDeps.length} dependencies were successfully updated`,
      icon: 'done',
    })

    return updatedDeps
  })
}

// @TODO
// function setup (context) {
//   // Package installation progress events
//   installProgress.on('progress', value => {
//     if (progress.get(PROGRESS_ID)) {
//       progress.set({ id: PROGRESS_ID, progress: value }, context)
//     }
//   })
//   installProgress.on('log', message => {
//     if (progress.get(PROGRESS_ID)) {
//       progress.set({ id: PROGRESS_ID, info: message }, context)
//     }
//   })
// }

// setup(getContext())

module.exports = {
  list,
  findOne,
  getPath,
  getMetadata: (id, context) => getPackageMetadata(id),
  getLink,
  getDescription,
  getVersion,
  install,
  uninstall,
  update,
  updateAll,
  invalidatePackage,
}
