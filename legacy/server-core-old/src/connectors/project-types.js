/**
 * @typedef ProjectType
 * @prop {string} id
 * @prop {string} name
 * @prop {string} [logo]
 * @prop {string} [description]
 * @prop {string} [link]
 * @prop {Function} filter
 * @prop {Function[]} createCbs
 * @prop {PluginConfig} pluginConfig
 */

/**
 * @typedef PluginConfig
 * @prop {Function} filterPlugin
 * @prop {Function} isOfficial
 * @prop {Function} getLink
 */

import folders from './folders'
import { log } from '../util/logger'

/** @type {ProjectType[]} */
let types = []

export function setTypes (value, context) {
  types = value
  log('Registered project types:', types.map(t => t.id))
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
