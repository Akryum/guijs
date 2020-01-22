import { ApolloClient } from 'apollo-client'
import { split, from } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { logErrorMessages } from '@vue/apollo-util'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { setContext } from 'apollo-link-context'
import { cache } from './cache'
import router from './router'

// Client ID to differentiate tabs
const clientId = `${Date.now()}-${Math.round(Math.random() * 100000)}`
console.log('client id', clientId)

// Scope context to current project
const getProjectId = () => router.currentRoute.params.projectId

let httpLink = setContext((req, context) => ({
  ...context,
  headers: {
    ...context.headers,
    'client-id': clientId,
    'project-id': getProjectId(),
  },
}))

// HTTP connection to the API
httpLink = httpLink.concat(createHttpLink({
  // You should use an absolute URL here
  uri: `http://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`,
}))

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  uri: `ws://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      context: {
        clientId,
        projectId: getProjectId(),
      },
    },
  },
})

const link = from([
  // Error handling
  onError(error => {
    logErrorMessages(error)
  }),

  // Select HTTP or WebSockets
  split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' &&
        operation === 'subscription'
    },
    wsLink,
    httpLink
  ),
])

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
})
