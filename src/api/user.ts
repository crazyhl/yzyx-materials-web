import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'
import { useUserStore } from 'src/stores/user-store'
import { router } from 'src/router'
export interface UserInfo {
  id: number;
  username: string;
  token: string;
}

const register = (username: string, password: string) => {
  return api.post<RequestResponse<UserInfo>>('/user/register', qs.stringify({ username, password }))
}

const login = (username: string, password: string) => {
  return api.post<RequestResponse<UserInfo>>('/user/login', qs.stringify({ username, password }))
}

const logout = () => {
  const store = useUserStore()
  store.clear()
  router.push('/login')
}

export { register, login, logout }
