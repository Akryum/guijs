import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { logErrorMessages } from '@vue/apollo-util'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// HTTP connection to the API
let link = onError(error => {
  logErrorMessages(error)
})

link = link.concat(createHttpLink({
  // You should use an absolute URL here
  uri: `http://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`,
}))

const wsClient = new SubscriptionClient(`http://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/subscriptions`, {
  reconnect: true,
})

// Create the subscription websocket link
const wsLink = new WebSocketLink(wsClient)

link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' &&
      operation === 'subscription'
  },
  wsLink,
  link
)

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
})
