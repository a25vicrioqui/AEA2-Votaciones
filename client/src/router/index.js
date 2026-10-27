import { createRouter, createWebHashHistory } from 'vue-router'
import LoginScreen from '@/pages/LoginScreen.vue'
import VotacionsScreen from '@/pages/VotacionsScreen.vue'

import { useAppStore } from '@/stores/app'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginScreen,
  },
  {
    path: '/votacions',
    name: 'Votacions',
    component: VotacionsScreen,

    meta: {
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const store = useAppStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) {
    return '/'
  }
})

export default router