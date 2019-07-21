/** @typedef {import('../connectors/project-types').ProjectType} ProjectType */

class ProjectTypeApi {
  /**
   * @param {ProjectType} projectType
   */
  constructor (projectType) {
    this.projectType = projectType
  }

  get logo () {
    return this.projectType.logo
  }

  set logo (value) {
    this.projectType.logo = value
  }

  set filterProject (callback) {
    this.projectType.filter = callback
  }

  onCreate (callback) {
    this.projectType.createCbs.push(callback)
  }

  hasPlugins (callback) {
    this.projectType.pluginConfig = {}
    callback(this.projectType.pluginConfig)
  }
}

module.exports = ProjectTypeApi
