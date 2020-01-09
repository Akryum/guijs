import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { logErrorMessages } from '@vue/apollo-util'

// HTTP connection to the API
let link = onError(error => {
  logErrorMessages(error)
})

link = link.concat(createHttpLink({
  // You should use an absolute URL here
  uri: `http://localhost:${process.env.VUE_APP_GRAPHQL_PORT}/graphql`,
}))

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
})
