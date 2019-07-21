const ProjectTypeApi = require('./ProjectTypeApi')

/** @typedef {import('../connectors/project-types').ProjectType} ProjectType */
/** @typedef {import('./PluginApi')} PluginApi */

/**
 * @typedef InProjectCb
 * @prop {any} plugin
 * @prop {(api: PluginApi) => void} callback
 */

export default class GlobalPluginApi {
  constructor (context) {
    this.context = context
    this.plugin = null
    /** @type {ProjectType[]} */
    this.projectTypes = []
    /** @type {InProjectCb[]} */
    this.inProjectCbs = []
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {(api: ProjectTypeApi) => void} callback
   */
  addProjectType (id, name, callback) {
    /** @type {ProjectType} */
    const projectType = {
      id,
      name,
      filter: () => false,
      createCbs: [],
      pluginConfig: null,
    }
    this.projectTypes.push(projectType)
    const api = new ProjectTypeApi(projectType)
    callback(api)
  }

  /**
   * @param {(api: PluginApi) => void} callback
   */
  inProject (callback) {
    this.inProjectCbs.push({
      plugin: this.plugin,
      callback,
    })
  }
}
