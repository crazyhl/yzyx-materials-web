import { route } from 'quasar/wrappers'
import {
  createRouter,
  createWebHistory
} from 'vue-router'
import { useUserStore } from 'stores/user-store'

import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

let router = null
export default route(function (/* { store, ssrContext } */) {
  // const createHistory = process.env.SERVER
  // ? createMemoryHistory
  // : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to) => {
    const requiredAuth = to.meta.requiresAuth
    if (requiredAuth === true) {
      // 校验是否已经登录
      const store = useUserStore()
      if (store.id === 0) {
        // 未登录，跳转到登录页
        return { name: 'Login' }
      }
    }
    if (to.path === '/') {
      return { name: 'Index' }
    }
  })
  router = Router
  return Router
})

export { router }
