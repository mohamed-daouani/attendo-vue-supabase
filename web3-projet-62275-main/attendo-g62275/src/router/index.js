import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SessionsView from '../views/SessionsView.vue'
import AboutView from '../views/AboutView.vue'
import SessionDetailsView from '../views/SessionDetailsView.vue'
import EpreuvesView from '../views/EpreuvesView.vue'
import LocauxEpreuveView from '../views/LocauxEpreuveView.vue'
import SurveillantsLocalView from '../views/SurveillantsLocalView.vue'
import { supabase } from '../lib/supabase/supabaseClient'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: SessionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:id',
      name: 'session-details',
      component: SessionDetailsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:sessionId/ue/:ueId',
      name: 'epreuves',
      component: EpreuvesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:sessionId/ue/:ueId/epreuve/:epreuveId',
      name: 'locaux-epreuve',
      component: LocauxEpreuveView,
      meta: { requiresAuth: true }
    },
    {
      path: '/sessions/:sessionId/ue/:ueId/epreuve/:epreuveId/local/:localId',
      name: 'surveillants-local',
      component: SurveillantsLocalView,
      meta: { requiresAuth: true }
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    next({
      path: from.fullPath || '/',
      query: { authRequired: 'true' }
    })
  } else {
    next()
  }
})

export default router
