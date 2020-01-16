import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
import { useSubscription, useQuery, useResult } from '@vue/apollo-composable'

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

export function useSetting (id) {
  const { result } = useQuery(gql`
    query darkModeSetting ($id: ID!) {
      setting (id: $id) {
        id
        value
      }
    }
  `, {
    id,
  })
  const setting = useResult(result, null, data => data.setting.value)

  useSubscription(gql`
    subscription darkModeSettingUpdated ($id: ID!) {
      settingUpdated (id: $id) {
        id
        value
      }
    }
  `, {
    id,
  })

  async function update (value) {
    return updateSetting(id, value)
  }

  return {
    setting,
    update,
  }
}
