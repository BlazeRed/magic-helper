import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from './stores/gameStore'
import HomeView from './views/HomeView.vue'
import NewGameView from './views/NewGameView.vue'
import GameView from './views/GameView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/new', component: NewGameView },
    { path: '/game', component: GameView },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(to => {
  if (to.path === '/game' && useGameStore().players.length === 0) return '/'
})

export default router
