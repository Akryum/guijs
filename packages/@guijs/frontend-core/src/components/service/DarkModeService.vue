<script>
import { onCommand } from '@/util/command'
import { useSetting } from '@/util/setting'
import { watch } from '@vue/composition-api'

const STORAGE_DARK_MODE = 'dev.guijs.darkMode'

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
  // eslint-disable-next-line no-console
  console.error(e)
}

export default {
  setup () {
    const { setting, loading, update } = useSetting('dark-mode')
    watch(setting, value => {
      if (!loading.value) {
        applyDarkMode(value)
      }
    })

    // Commands

    onCommand('toggle-dark-mode', async () => {
      await update(!setting.value)
    })
  },
}
</script>
