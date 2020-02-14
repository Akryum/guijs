import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './components/Home.vue'
import FirstDownload from './components/FirstDownload.vue'
import UpdateProgress from './components/UpdateProgress.vue'
import UpdatePrompt from './components/UpdatePrompt.vue'
import NodeNotFound from './components/NodeNotFound.vue'
import NodeWrongVersion from './components/NodeWrongVersion.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/first-download',
    name: 'first-download',
    component: FirstDownload,
  },
  {
    path: '/update-progress',
    name: 'update-progress',
    component: UpdateProgress,
  },
  {
    path: '/update-prompt',
    name: 'update-prompt',
    component: UpdatePrompt,
  },
  {
    path: '/node-not-found',
    name: 'node-not-found',
    component: NodeNotFound,
  },
  {
    path: '/node-wrong-version',
    name: 'node-wrong-version',
    component: NodeWrongVersion,
  },
  {
    path: '*',
    redirect: { name: 'home' },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
