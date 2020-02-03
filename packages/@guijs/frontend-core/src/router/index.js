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
            components: {
              default: () => import(
                /* webpackChunkName: 'PackagesPage' */
                '../components/pkg/PackagesPage.vue'
              ),

              header: () => import(
                /* webpackChunkName: 'ProjectTypeHeader' */
                '../components/pkg/ProjectTypeHeader.vue'
              ),
            },
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
          {
            path: 'scripts',
            components: {
              default: RouterViewOnly,

              aside: () => import(
                /* webpackChunkName: 'ScriptList' */
                '../components/script/ScriptList.vue'
              ),
            },
            children: [
              {
                path: '',
                name: 'project-scripts',
                component: Empty,
              },
              {
                path: ':scriptId',
                name: 'project-script',
                component: () => import(
                  /* webpackChunkName: 'ScriptView' */
                  '../components/script/ScriptView.vue'
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
