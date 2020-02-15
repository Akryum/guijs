import './plugins'
import Vue from 'vue'
import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './components/App.vue'
import router from './router'
import { apolloClient } from './apollo'
import { i18n } from './util/i18n'

Vue.config.productionTip = false

// Require all the components that start with 'BaseXXX.vue'
const requireComponents = require.context('./components', true, /Base[a-z0-9]+\.(jsx?|vue)$/i)
requireComponents.keys().forEach(fileName => {
  const component = requireComponents(fileName)
  const name = fileName.match(/(Base[a-z0-9]+)\./i)[1]
  Vue.component(name, component.default || component)
})

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
