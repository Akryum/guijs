import { InMemoryCache } from '@apollo/client/cache'

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        projectType: {
          read: (existing, { args, toReference }) => existing ?? toReference({ __typename: 'ProjectType', id: args.id }),
        },
        script: {
          read: (existing, { args, toReference }) => existing ?? toReference({ __typename: 'NpmScript', id: args.id }),
        },
      },
    },
  },
})
