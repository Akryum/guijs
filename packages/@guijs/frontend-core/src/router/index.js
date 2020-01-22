import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const RouterViewOnly = { render: h => h('router-view') }
const Empty = { render: h => null }

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
    path: '/project/:projectId',
    component: RouterViewOnly,
    children: [
      {
        path: '',
        name: 'project-home',
        component: () => import(
          /* webpackChunkName: 'HomePage' */
          '../components/HomePage.vue'
        ),
      },
      {
        path: 'worskpace/:workspaceId?',
        component: () => import(
          /* webpackChunkName: 'ProjectMainLayout' */
          '../components/project/ProjectMainLayout.vue'
        ),
        children: [
          {
            path: 'packages',
            component: () => import(
              /* webpackChunkName: 'PackagesPage' */
              '../components/pkg/PackagesPage.vue'
            ),
            meta: {
              hideAside: true,
            },
            children: [
              {
                path: '',
                name: 'project-packages',
                component: Empty,
              },
              {
                path: 'project-type/:projectTypeId',
                name: 'project-type-packages',
                component: () => import(
                  /* webpackChunkName: 'ProjectTypePackages' */
                  '../components/pkg/ProjectTypePackages.vue'
                ),
              },
            ],
          },
        ],
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
