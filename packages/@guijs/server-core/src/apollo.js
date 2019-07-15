const http = require('http')
const chalk = require('chalk')
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { PubSub } = require('graphql-subscriptions')
const merge = require('deepmerge')

const { defaultValue, autoCall } = require('@guijs/utils')

module.exports = (options, cb = null) => {
  // Default options
  options = merge({
    integratedEngine: false,
  }, options)

  // Express app
  const app = express()

  // Customize those files
  let typeDefs = require('./type-defs')
  const resolvers = require('./resolvers')
  const context = require('./context')
  const schemaDirectives = require('./directives')
  let pubsub
  try {
    pubsub = require('./pubsub')
  } catch (e) {
    if (process.env.NODE_ENV !== 'production' && !options.quiet) {
      console.log(chalk.yellow('Using default PubSub implementation for subscriptions.'))
      console.log(chalk.grey(`You should provide a different implementation in production (for example with Redis) by exporting it in 'apollo-server/pubsub.js'.`))
    }
  }

  // GraphQL API Server

  // Realtime subscriptions
  if (!pubsub) pubsub = new PubSub()

  // Customize server
  try {
    const serverModule = require('./server')
    serverModule(app)
  } catch (e) {
    // No file found
  }

  // Apollo server options

  typeDefs = processSchema(typeDefs)

  /** @type {import('apollo-server-express').ApolloServerExpressConfig} */
  let apolloServerOptions = {
    typeDefs,
    resolvers,
    schemaDirectives,
    tracing: true,
    cacheControl: true,
    engine: !options.integratedEngine,
    // Resolvers context from POST
    context: async ({ req, connection }) => {
      let contextData
      try {
        if (connection) {
          contextData = await autoCall(context, { connection })
        } else {
          contextData = await autoCall(context, { req })
        }
      } catch (e) {
        console.error(e)
        throw e
      }
      contextData = Object.assign({}, contextData, { pubsub })
      return contextData
    },
    // Resolvers context from WebSocket
    subscriptions: {
      path: options.subscriptionsPath,
      onConnect: async (connection, websocket) => {
        let contextData = {}
        try {
          contextData = await autoCall(context, {
            connection,
            websocket,
          })
          contextData = Object.assign({}, contextData, { pubsub })
        } catch (e) {
          console.error(e)
          throw e
        }
        return contextData
      },
    },
    formatError (error) {
      console.log(chalk.red(`⚠️  An error occured in resolver: ${chalk.bold(error.path.join('.'))}`))
      console.log(chalk.red(error.originalError.stack))
      if (process.env.GUIJS_DEBUG) {
        error.message += `\nServer Error:\n${error.originalError.stack}\n`
      }
      return error
    },
  }

  // Final options
  apolloServerOptions = merge(apolloServerOptions, defaultValue(options.serverOptions, {}))

  // Apollo Server
  const server = new ApolloServer(apolloServerOptions)

  // Express middleware
  server.applyMiddleware({
    app,
    path: options.graphqlPath,
    cors: options.cors,
  })

  // Start server
  const httpServer = http.createServer(app)
  httpServer.setTimeout(options.timeout)
  server.installSubscriptionHandlers(httpServer)

  httpServer.listen({
    host: options.host || 'localhost',
    port: options.port,
  }, () => {
    if (!options.quiet) {
      console.log(`✔️  GraphQL Server is running on ${chalk.cyan(`http://localhost:${options.port}${options.graphqlPath}`)}`)
      if (process.env.NODE_ENV !== 'production' && !process.env.VUE_CLI_API_MODE) {
        console.log(`✔️  Type ${chalk.cyan('rs')} to restart the server`)
      }
    }

    cb && cb()
  })
}

function processSchema (typeDefs) {
  if (Array.isArray(typeDefs)) {
    return typeDefs.map(processSchema)
  }

  if (typeof typeDefs === 'string') {
    // Convert schema to AST
    typeDefs = gql(typeDefs)
  }

  // Remove upload scalar (it's already included in Apollo Server)
  removeFromSchema(typeDefs, 'ScalarTypeDefinition', 'Upload')

  return typeDefs
}

function removeFromSchema (document, kind, name) {
  const definitions = document.definitions
  const index = definitions.findIndex(
    def => def.kind === kind && def.name.kind === 'Name' && def.name.value === name
  )
  if (index !== -1) {
    definitions.splice(index, 1)
  }
}
