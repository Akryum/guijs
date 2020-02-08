import { toIdValue } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'

export const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      projectType: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'ProjectType', id })),
      script: (_, { id }) => toIdValue(cache.config.dataIdFromObject({ __typename: 'NpmScript', id })),
    },
  },
})
