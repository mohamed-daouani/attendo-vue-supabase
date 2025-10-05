import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase/supabaseClient'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  const initializeUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user
    })
  }

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      user.value = null
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error.message)
    }
  }

  return {
    user,
    initializeUser,
    login,
    logout
  }
})