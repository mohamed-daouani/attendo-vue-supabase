<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { addEpreuve } from '@/service/listEpreuvesService.js'

const props = defineProps({
  sessionCompoId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['epreuveAdded'])

const epreuve = ref({
  intitule: '',
  bilan: '',
  projet: '',
  examen: ''
})

const handleSubmit = async () => {
  if (!epreuve.value.intitule.trim()) return
  
  try {
    const addedEpreuve = await addEpreuve(props.sessionCompoId, epreuve.value)
    if (addedEpreuve) {
      emit('epreuveAdded', addedEpreuve)
      epreuve.value = {
        intitule: '',
        bilan: '',
        projet: '',
        examen: ''
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'épreuve :', error)
  }
}
</script>

<template>
  <form
    class="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-4 m-8 hover:shadow-xl transition-all duration-200"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors duration-200">Ajouter une épreuve</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-indigo-700">Intitulé</label>
        <input
          v-model="epreuve.intitule"
          type="text"
          placeholder="Bilan, Projet, Examen..."
          class="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
        />
      </div>
    </div>

    <div class="flex justify-end">
      <BaseButton
        customClass="border border-indigo-600 text-indigo-800 hover:bg-indigo-800 hover:text-white px-4 py-2 rounded transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Créer
      </BaseButton>
    </div>
  </form>
</template> 