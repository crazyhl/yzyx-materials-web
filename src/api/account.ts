import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'
import { Breed } from './breed'

export interface AddAccountForm { // 添加账户 model
  name: string; // 账户名称
  description?: string; // 描述
  expect_total_money?: number; // 预计总金额
  per_part_money?: number; // 每份金额
  expect_rate_of_return?: number; // 预计收益率
}

export interface EditAccountForm { // 添加账户 model
  id: number;
  name: string; // 账户名称
  description?: string; // 描述
  expect_total_money?: number; // 预计总金额
  per_part_money?: number; // 每份金额
  expect_rate_of_return?: number; // 预计收益率
}

export interface AccountBreed {
  id: number;
  create_at: number;
  update_at: number;
  breed: Breed;
  cost: number;
  total_count: number;
  total_cost: number;
  total_account_per_part_count: number;
}
export interface Account {
  id: number;
  create_at: number;
  update_at: number;
  name: string;
  desc: string;
  total: number;
  expect_total: number;
  expect_rate_of_return: number;
  rate_of_return: number;
  per_part: number;
  profit_amount: number;
  breeds?: AccountBreed[];
}

// 添加账户
const addAccount = (account: AddAccountForm) => {
  return api.post<RequestResponse<Account>>('/account/add', qs.stringify(account))
}

// 编辑账户
const editAccount = (account: EditAccountForm) => {
  return api.put<RequestResponse<Account>>('/account/update/' + account.id, qs.stringify(account))
}

// 删除账户
const deleteAccount = (id: number) => {
  return api.delete<RequestResponse<Account>>('/account/delete/' + id)
}

// 账户详情
const detailAccount = (id: number) => {
  return api.get<RequestResponse<Account>>('/account/' + id)
}

export interface AccountList {
  data: Account[];
  count: number;
}

// 账户列表
const accountList = (page: number) => {
  return api.get<RequestResponse<AccountList>>('/account/list?p=' + page)
}

// 绑定品种
const accountBindBreed = (accountId: number, breedId: number) => {
  return api.post<RequestResponse<Breed>>('/account/' + accountId + '/bindBreed', {
    id: breedId
  })
}

// 绑定品种
const acountAddBreedBuyItem = (accountId: number, breedId: number, createAt: number, cost: number, count: number) => {
  return api.post<RequestResponse<Breed>>('/account/' + accountId + '/addBreedBuyItem', {
    id: breedId,
    create_at: createAt,
    cost,
    count
  })
}

export { addAccount, accountList, editAccount, deleteAccount, detailAccount, accountBindBreed, acountAddBreedBuyItem }
