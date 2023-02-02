import VueI18n from 'vue-i18n'

// @TODO load locales from server

import en from '../assets/locales/en.json'

const messages = {
  en,
}

export const i18n = new VueI18n({
  locale: 'en',
  messages,
  silentTranslationWarn: true,
})

// Hot updates
if (import.meta.hot) {
  import.meta.hot.accept(['../assets/locales/en.json'], ([en]) => {
    i18n.setLocaleMessage('en', en.default)
  })
}
