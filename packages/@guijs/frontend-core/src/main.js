import '@guijs/frontend-ui/styles/main.postcss'

import './plugins'
import Vue, { provide } from 'vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './components/App.vue'
import router from './router'
import { apolloClient } from './apollo'
import { i18n } from './util/i18n'

Vue.config.productionTip = false

// Import all the components that start with 'BaseXXX.vue'
const baseComponents = import.meta.globEager('./components/base/*.vue')
for (const path in baseComponents) {
  const component = baseComponents[path]
  const name = path.match(/(Base[a-z0-9]+)\./i)[1]
  Vue.component(name, component.default || component)
}

const app = new Vue({
  router,
  i18n,

  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: h => h(App),
})

router.onReady(() => {
  app.$mount('#app')
})
