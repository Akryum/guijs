import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
import { useSubscription, useQuery } from '@vue/apollo-composable'
import { computed } from 'vue'

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
  const { result, loading } = useQuery(gql`
    query darkModeSetting ($id: ID!) {
      setting (id: $id) {
        id
        value
      }
    }
  `, {
    id,
  })
  const setting = computed(() => result.value?.setting.value)

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
    loading,
    update,
  }
}
