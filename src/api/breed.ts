import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'

export interface AddBreedForm { // 添加品种 model
  code: string; // 代码
  name: string; // 名称
  net_value?: number; // 净值
  cost?: number; // 成本
}

export interface EditBreedForm { // 添加品种 model
  id: number;
  code: string; // 代码
  name: string; // 名称
  net_value?: number; // 净值
  cost?: number; // 成本
}

export interface Breed {
  id: number;
  create_at: number;
  update_at: number;
  code: string;
  name: string;
  net_value: number;
  cost: number;
  total_count: number;
  total_cost: number;
  total_net_value: number;
}

// 添加品种
const addBreed = (breed: AddBreedForm) => {
  return api.post<RequestResponse<Breed>>('/breed/add', qs.stringify(breed))
}

// 编辑品种
const editBreed = (breed: EditBreedForm) => {
  return api.put<RequestResponse<Breed>>('/breed/' + breed.id, qs.stringify(breed))
}

// 删除品种
const deleteBreed = (id: number) => {
  return api.delete<RequestResponse<Breed>>('/breed/' + id)
}

export interface BreedList {
  data: Breed[];
  count: number;
}

// 账户列表
const breedList = (page: number) => {
  return api.get<RequestResponse<BreedList>>('/breed/list?p=' + page)
}

export { addBreed, breedList, editBreed, deleteBreed }
