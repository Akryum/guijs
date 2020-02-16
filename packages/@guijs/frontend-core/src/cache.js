import { InMemoryCache } from 'apollo-cache-inmemory'

export const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      projectType: (_, { id }, { getCacheKey }) => getCacheKey({ __typename: 'ProjectType', id }),
      script: (_, { id }, { getCacheKey }) => getCacheKey({ __typename: 'NpmScript', id }),
    },
  },
})
