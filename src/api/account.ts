import { api } from '../boot/axios'
import qs from 'qs'
import { RequestResponse } from './response'

export interface AddAccount { // 添加账户 model
  name: string; // 账户名称
  description?: string; // 描述
  expect_total_money?: number; // 预计总金额
  per_part_money?: number; // 每份金额
  expect_rate_of_return?: number; // 预计收益率
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
}

const addAccount = (account: AddAccount) => {
  return api.post<RequestResponse<Account>>('/account/add', qs.stringify(account))
}

export interface AccountList {
  data: Account[];
  count: number;
}

const accountList = (page: number) => {
  return api.get<RequestResponse<AccountList>>('/account/list?p=' + page)
}

export { addAccount, accountList }
