<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          有知有行黑板报小工具
        </q-toolbar-title>

        <div>
          <q-btn-dropdown flat text-color="white" :label="store.username">
            <q-list>
              <q-item clickable v-close-popup @click="onLogout">
                <q-item-section>
                  <q-item-label>退出</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { logout } from 'src/api/user'
import { useUserStore } from 'src/stores/user-store'

const linksList = [
  {
    title: '概览',
    icon: 'fa-solid fa-gauge-high',
    link: '/index'
  },
  {
    title: '账户管理',
    icon: 'fa-solid fa-wallet',
    link: '/account/list'
  },
  {
    title: '品种管理',
    icon: 'fa-solid fa-cubes',
    link: '/breed/list'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const store = useUserStore()
    const onLogout = () => {
      logout()
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      store,
      onLogout
    }
  }
})
</script>
