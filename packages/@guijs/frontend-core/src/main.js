import './plugins'
import Vue from 'vue'
import { provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import router from './router'
import { apolloClient } from './apollo'

Vue.config.productionTip = false

new Vue({
  router,

  setup () {
    provide(DefaultApolloClient, apolloClient)
  },

  render: h => h(App),
}).$mount('#app')
