import { defineStore } from 'pinia'

export const useUserStore = defineStore('userLogin', {
  state: () => {
    return {
      id: 0,
      username: '',
      token: ''
    }
  },
  getters: {
  },
  actions: {
    save (uid: number, username: string, token: string) {
      this.id = uid
      this.username = username
      this.token = token

      // 存储到 localstorage 一份
      localStorage.setItem('userInfo', JSON.stringify({
        id: uid,
        username,
        token
      }))
    },
    // 清除用户信息，就是退出了
    clear () {
      localStorage.removeItem('userInfo')
      this.id = 0
      this.username = ''
      this.token = ''
    }
  }
})
