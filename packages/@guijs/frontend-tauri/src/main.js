import '@guijs/frontend-ui/styles/main.postcss'

import Vue from 'vue'
import App from './components/App.vue'

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(App),
})

app.$mount('#app')
