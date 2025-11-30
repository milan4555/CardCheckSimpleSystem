import { createRouter, createWebHistory } from 'vue-router'
import CardReader from '../CardReader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      { path: '/', component: CardReader }
  ],
})

export default router
