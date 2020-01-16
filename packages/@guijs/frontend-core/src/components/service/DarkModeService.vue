<script>
import { useQuery, useSubscription, useResult } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { onCommand } from '@/util/command'
import { updateSetting } from '@/util/setting'
import { watch } from '@vue/composition-api'

const STORAGE_DARK_MODE = 'dev.guijs.darkMode'

export default {
  setup () {
    function applyDarkMode (value) {
      const el = document.documentElement
      if (value) {
        el.classList.add('mode-dark')
      } else {
        el.classList.remove('mode-dark')
      }
      localStorage.setItem(STORAGE_DARK_MODE, JSON.stringify(value))
    }

    // LocalStorage to apply instantly

    try {
      const storageValue = localStorage.getItem(STORAGE_DARK_MODE)
      if (storageValue) {
        applyDarkMode(JSON.parse(storageValue))
      }
    } catch (e) {
      console.error(e)
    }

    // GraphQL

    const { result } = useQuery(gql`
      query darkModeSetting {
        darkMode: setting (id: "dark-mode") {
          id
          value
        }
      }
    `)
    const darkMode = useResult(result, null, data => data.darkMode.value)

    watch(darkMode, applyDarkMode)

    useSubscription(gql`
      subscription darkModeSettingUpdated {
        darkModeSettingUpdated: settingUpdated (id: "dark-mode") {
          id
          value
        }
      }
    `)

    // Commands

    onCommand('toggle-dark-mode', async () => {
      await updateSetting('dark-mode', !darkMode.value)
    })
  },
}
</script>
