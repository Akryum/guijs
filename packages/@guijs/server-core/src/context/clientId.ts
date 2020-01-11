import { onCreate } from '@nodepack/app-context'

onCreate(context => {
  context.getClientId = function () {
    if (this.connection) {
      return this.connection.context.clientId
    }
    if (this.req) {
      return this.req.headers['client-id']
    }
  }
})

export default interface ClientIdContext {
  getClientId: () => string
}
