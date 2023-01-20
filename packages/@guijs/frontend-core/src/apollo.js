import {
  ApolloClient,
  split,
  from,
  createHttpLink,
} from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { setContext } from '@apollo/client/link/context'
import { logErrorMessages } from '@vue/apollo-util'
import { getMainDefinition } from 'apollo-utilities'
import { cache } from './cache'
import router from './router'

// Client ID to differentiate tabs
const clientId = `${Date.now()}-${Math.round(Math.random() * 100000)}`
// eslint-disable-next-line no-console
console.log('client id', clientId)

// Scope context to current project
const getProjectId = () => router.currentRoute.params.projectId || ''

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
  // @TODO better endpoint handling (dynamic ports)
  uri: import.meta.env.VITE_GRAPHQL_BASE_URL,
}))

// Create the subscription websocket link
const wsLink = new WebSocketLink({
  // @TODO better endpoint handling (dynamic ports)
  uri: import.meta.env.VITE_GRAPHQL_WS_URL,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      context: {
        clientId,
        projectId: getProjectId(),
      },
    }),
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
    httpLink,
  ),
])

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
})
