import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { errorNotify } from 'src/utils/notify'
import { useUserStore } from '../stores/user-store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const baseUrl = process.env.NODE_ENV === 'production' ? 'https://backend:8080' : 'http://127.0.0.1:8080'
const api = axios.create({ baseURL: baseUrl })
const userStore = useUserStore()

// 添加请求拦截器
api.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (userStore.id > 0) {
    // 设置 token
    config.headers.common.Authorization = 'Bearer ' + userStore.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 提示错误信息
  errorNotify(error.response.data.message, {})
  return Promise.reject(error)
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
