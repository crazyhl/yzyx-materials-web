import { defineStore } from 'pinia'
import { Account } from '../api/account'

export const useAccountDetailStore = defineStore('accountDetail', {
  state: () => {
    return {
      account: {
        id: 0,
        create_at: 0,
        update_at: 0,
        name: '',
        desc: '',
        total: 0,
        expect_total: 0,
        expect_rate_of_return: 0,
        rate_of_return: 0,
        per_part: 0,
        profit_amount: 0
      }
    }
  },
  getters: {
  },
  actions: {
    set (acc: Account) {
      this.account = acc
    }
  }
})
