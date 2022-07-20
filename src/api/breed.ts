import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'
import { BreedBuyItem } from './account'

export interface AddBreedForm { // 添加品种 form
  code: string; // 代码
  name: string; // 名称
  net_value?: number; // 净值
  cost?: number; // 成本
}

export interface EditBreedForm { // 添加品种 form
  id: number;
  code: string; // 代码
  name: string; // 名称
  net_value?: number; // 净值
  cost?: number; // 成本
}

export interface UpdateNetValueForm { // 更新品种净值form
  id: number;
  net_value: number; // 净值
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

// 编辑品种
const editBreedNetValue = (form: UpdateNetValueForm) => {
  return api.put<RequestResponse<Breed>>('/breed/' + form.id + '/netValue', qs.stringify(form))
}

export interface BreedList {
  data: Breed[];
  count: number;
}

// 账户列表
const breedList = (page: number, filter: string) => {
  return api.get<RequestResponse<BreedList>>('/breed/list?p=' + page + '&filter=' + filter)
}

const allBreedList = () => {
  return api.get<RequestResponse<Array<Breed>>>('/breed/allList')
}

// 更新品种购买记录
const updateAddBreedBuyItem = (itemId: number, createAt: number, cost: number, count: number, fee: number) => {
  return api.put<RequestResponse<BreedBuyItem>>('/breed/updateBuyItem', {
    id: itemId,
    create_at: createAt,
    cost,
    count,
    fee
  })
}

export { addBreed, breedList, editBreed, deleteBreed, editBreedNetValue, allBreedList, updateAddBreedBuyItem }
