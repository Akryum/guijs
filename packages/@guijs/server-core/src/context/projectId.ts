import { onCreate } from '@nodepack/app-context'

onCreate(context => {
  context.getProjectId = function () {
    if (this.connection) {
      return this.connection.context.projectId
    }
    if (this.req) {
      return this.req.headers['project-id']
    }
  }
})

export default interface ProjectIdContext {
  getProjectId: () => string
}
