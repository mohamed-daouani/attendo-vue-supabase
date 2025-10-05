<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { addSession } from '@/service/listSessionsService.js'

const newSession = ref('')
const emit = defineEmits(['sessionAdded'])

const handleSubmit = async () => {
  if (!newSession.value.trim()) return
  
  try {
    const addedSession = await addSession(newSession.value)
    if (addedSession) {
      emit('sessionAdded', addedSession)
      newSession.value = ''
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la session :', error)
  }
}

defineProps({
  customClass: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <form
    class="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-4 m-8 hover:shadow-xl transition-all duration-200"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors duration-200">Ajouter une session</h2>

    <div>
      <input
        v-model="newSession"
        type="text"
        placeholder="Nouvelle session"
        class="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
      />
    </div>

    <div class="flex justify-end">
      <BaseButton
        customClass="border border-indigo-600 text-indigo-800 hover:bg-indigo-800 hover:text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Ajouter
      </BaseButton>
    </div>
  </form>
</template>
  