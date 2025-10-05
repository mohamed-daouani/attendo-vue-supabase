<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase/supabaseClient'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import BaseButton from './BaseButton.vue'
import { useUserStore } from '../stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onMounted(() => {
  userStore.initializeUser()
})

const handleGoogleLogin = () => {
  userStore.login()
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}
</script>

<template>
  <header class="bg-indigo-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-3xl font-bold text-white hover:text-indigo-200 transition-colors duration-200">Attendo</h1>

      <nav class="flex items-center space-x-8">
        <RouterLink to="/" class="text-indigo-100 hover:text-white transition-colors duration-200 hover:scale-105">Accueil</RouterLink>
        <RouterLink to="/sessions" class="text-indigo-100 hover:text-white transition-colors duration-200 hover:scale-105">Sessions</RouterLink>
        <RouterLink to="/about" class="text-indigo-100 hover:text-white transition-colors duration-200 hover:scale-105">À propos</RouterLink>

        <div v-if="user" class="flex items-center space-x-4">
          <span class="text-indigo-100 hover:text-white transition-colors duration-200">{{ user.email }}</span>
          <BaseButton 
            :onClick="handleLogout"
            customClass="border border-indigo-400 rounded px-4 py-2 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Déconnexion
          </BaseButton>
        </div>

        <BaseButton v-else 
          :onClick="handleGoogleLogin" 
          customClass="border border-indigo-400 rounded px-4 py-2 hover:bg-indigo-700 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Connexion avec Google
        </BaseButton>
      </nav>
    </div>
  </header>
</template>


