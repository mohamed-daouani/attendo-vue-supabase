<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabase/supabaseClient'

const user = ref(null)

onMounted(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user
  })
})
</script>

<template>
  <main class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200">
      <template v-if="user">
        <h2 class="text-2xl font-semibold mb-4 text-indigo-900 hover:text-indigo-700 transition-colors duration-200">Bienvenue {{ user.email }} !</h2>
        <p class="text-indigo-700 hover:text-indigo-800 transition-colors duration-200">Nous sommes ravis de vous revoir sur Attendo</p>
      </template>
      <template v-else>
        <h2 class="text-2xl font-semibold mb-4 text-indigo-900 hover:text-indigo-700 transition-colors duration-200">Bienvenue sur Attendo</h2>
        <p class="text-indigo-700 hover:text-indigo-800 transition-colors duration-200">Votre assistant de présence intelligent</p>
        <div class="mt-4">
          <p class="text-indigo-600 hover:text-indigo-700 transition-colors duration-200">Connectez-vous pour accéder à toutes les fonctionnalités</p>
        </div>
      </template>
    </div>
  </main>
</template>
