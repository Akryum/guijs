import Vue from 'vue'
import App from './components/App.vue'
import router from './router'

Vue.config.productionTip = false

const app = new Vue({
  router,
  render: h => h(App),
})

router.onReady(() => {
  app.$mount('#app')
})
