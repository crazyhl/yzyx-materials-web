import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/reg',
    name: 'register',
    component: () => import('src/pages/RegisterPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/pages/LoginPage.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/account/list',
        component: () => import('pages/AccountListPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/breed/list',
        component: () => import('pages/AccountListPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/index',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
