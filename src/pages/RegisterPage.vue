<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="column items-center justify-evenly">
        <div>
          <div class="text-h4">有知有行黑板报计算器 - 注册</div>
          <div class="q-pa-md" style="max-width: 400px">
            <q-form
              @submit="onSubmit"
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="username"
                label="Your username *"
                hint="Please input username"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please input username']"
              />

              <q-input
                filled
                type="password"
                v-model="password"
                label="Your password *"
                lazy-rules
                :rules="[
                  val => val && val.length > 0 || 'Please input password'
                ]"
              />
              <div>
                <q-btn label="注册" type="submit" color="primary"/>
                &nbsp;
                <q-btn label="登录" @click="onLogin" color="white"  text-color="black"/>
              </div>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { register } from '../api/user'
import { useUserStore } from 'stores/user-store'
import { useRouter } from 'vue-router'
import { successNotify } from '../utils/notify'

export default defineComponent({
  name: 'IndexPage',
  setup () {
    const username = ref('')
    const password = ref('')
    const store = useUserStore()
    const router = useRouter()

    const onSubmit = async () => {
      const { data } = await register(username.value, password.value)
      const userInfo = data.data
      store.save(userInfo.id, userInfo.username, userInfo.token)
      // 注册成功后跳转
      successNotify('注册成功，即将跳转到使用界面', {
        onDismiss: () => {
          router.push('/')
        }
      })
    }

    const onLogin = () => {
      router.push('/login')
    }

    return {
      username,
      password,
      onSubmit,
      onLogin,
      store
    }
  }
})
</script>
