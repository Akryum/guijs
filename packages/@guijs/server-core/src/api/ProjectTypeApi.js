/** @type {import('../util/project-type').ProjectType} ProjectType */

class ProjectTypeApi {
  /**
   * @param {ProjectType} projectType
   */
  constructor (projectType) {
    this.projectType = projectType
  }

  filterProject (callback) {
    this.projectType.filter = callback
  }
}

module.exports = ProjectTypeApi
