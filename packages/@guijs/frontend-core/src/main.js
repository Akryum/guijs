import './plugins'
import Vue from 'vue'
import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './components/App.vue'
import router from './router'
import { apolloClient } from './apollo'
import { i18n } from './util/i18n'

Vue.config.productionTip = false

new Vue({
  router,
  i18n,

  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: h => h(App),
}).$mount('#app')
