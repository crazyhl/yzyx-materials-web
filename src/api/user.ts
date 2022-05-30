import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'

export interface UserInfo {
  id: number;
  username: string;
  token: string;
}

const register = (username: string, password: string) => {
  return api.post<RequestResponse<UserInfo>>('/user/register', qs.stringify({ username, password }))
}

const login = (username: string, password: string) => {
  return api.post<RequestResponse<UserInfo>>('/user/register', qs.stringify({ username, password }))
}

export { register, login }
