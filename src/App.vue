<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useUserStore } from 'stores/user-store'
import { UserInfo } from './api/user'

export default defineComponent({
  name: 'App',
  setup () {
    onMounted(() => {
      // 如果 local storage 包含 userInfo 则进行赋值
      const info = localStorage.getItem('userInfo')
      if (info !== null && info !== undefined) {
        const userInfoObj = JSON.parse(info) as UserInfo
        const store = useUserStore()
        store.save(userInfoObj.id, userInfoObj.username, userInfoObj.token)
      }
    })
  }
})
</script>
