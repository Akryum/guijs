import { onCreate } from '@nodepack/app-context'
import { MetaProject } from '@/schema/project/meta-types'

onCreate(context => {
  context.getProjectId = function () {
    if (this.connection) {
      return this.connection.context.projectId
    }
    if (this.req) {
      return this.req.headers['project-id']
    }
  }

  context.getProject = function () {
    const projectId = this.getProjectId()
    if (!projectId) return null
    return this.db.projects.findOne({ _id: projectId })
  }
})

export default interface ProjectIdContext {
  getProjectId: () => string
  getProject: () => Promise<MetaProject>
}
