import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(
      /* webpackChunkName: 'HomePage' */
      '../components/HomePage.vue'
    ),
  },
  {
    path: '/:projectId',
    component: { render: h => h('router-view') },
    children: [
      {
        path: '',
        name: 'project-home',
        component: () => import(
          /* webpackChunkName: 'HomePage' */
          '../components/HomePage.vue'
        ),
      },
    ],
  },
  {
    path: '/terminals',
    name: 'terminals',
    component: () => import(
      /* webpackChunkName: 'Terminals' */
      '../components/terminal/Terminals.vue'
    ),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
