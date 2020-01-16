import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'

export async function updateSetting (id, value) {
  await apolloClient.mutate({
    mutation: gql`
      mutation updateSetting ($input: UpdateSettingInput!) {
        updateSetting (input: $input) {
          id
          value
        }
      }
    `,
    variables: {
      input: {
        id,
        value,
      },
    },
  })
}
