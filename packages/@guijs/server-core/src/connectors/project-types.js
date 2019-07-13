/**
 * @typedef ProjectType
 * @prop {string} id
 * @prop {string} name
 * @prop {string} [logo]
 * @prop {Function} filter
 */

import folders from './folders'

/** @type {ProjectType[]} */
let types = []

export function setTypes (value, context) {
  types = value
}

export function getType (id, context) {
  return types.find(t => t.id === id)
}

export function getTypes (context) {
  return types
}

export async function detectType ({ file }, context) {
  if (!folders.isPackage(file)) {
    return null
  }

  try {
    const pkg = folders.readPackage(file, context)
    pkg.dependencies = pkg.dependencies || {}
    pkg.devDependencies = pkg.devDependencies || {}
    for (const projectType of getTypes()) {
      if (typeof projectType.filter === 'function') {
        if (await projectType.filter({
          folder: file,
          pkg,
        })) {
          return projectType.id
        }
      }
    }
  } catch (e) {
    if (process.env.GUIJS_DEBUG) {
      console.log(e)
    }
  }
  return 'unknown'
}
