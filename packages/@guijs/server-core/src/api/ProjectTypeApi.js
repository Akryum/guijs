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

  filterProject (callback) {
    this.projectType.filter = callback
  }

  onCreate (callback) {
    this.projectType.createCbs.push(callback)
  }
}

module.exports = ProjectTypeApi
