import VueI18n from 'vue-i18n'

// @TODO load locales from server

const messages = {
  en: require('@/assets/en.json'),
}

export const i18n = new VueI18n({
  locale: 'en',
  messages,
})

// Hot updates
if (module.hot) {
  module.hot.accept(['@/assets/en.json'], function () {
    i18n.setLocaleMessage('en', require('@/assets/en.json'))
  })
}
