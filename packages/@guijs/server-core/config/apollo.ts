import { Config } from 'apollo-server-express'
import consola from 'consola'

export default {
  apolloServerOptions: {
    formatError (error) {
      consola.error(error, error.originalError)
      return error
    },
  } as Config,
}
