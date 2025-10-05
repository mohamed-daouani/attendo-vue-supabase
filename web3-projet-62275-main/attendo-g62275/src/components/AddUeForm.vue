<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import { addUeToSession, getUEs } from '@/service/listUeService.js'

const props = defineProps({
  existingUes: {
    type: Array,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['ueAdded'])

const selectedUe = ref('')
const allUes = ref([])

onMounted(async () => {
  try {
    allUes.value = await getUEs()
  } catch (error) {
    console.error('Erreur lors du chargement des UE :', error)
  }
})

const availableUes = computed(() => {
  return allUes.value.filter(ue => !props.existingUes.some(existingUe => existingUe.ue === ue.ue))
})

const handleSubmit = async () => {
  if (!selectedUe.value) return

  try {
    const addedUe = await addUeToSession(props.sessionId, selectedUe.value)
    if (addedUe) {
      emit('ueAdded', addedUe)
      selectedUe.value = ''
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'UE :', error)
  }
}
</script>

<template>
  <form
    class="max-w-xl mx-auto bg-white rounded-lg shadow p-6 space-y-4 m-8 hover:shadow-xl transition-all duration-200"
    @submit.prevent="handleSubmit"
  >
    <h2 class="text-xl font-bold text-indigo-900 hover:text-indigo-700 transition-colors duration-200">Ajouter une UE</h2>

    <div>
      <select
        v-model="selectedUe"
        class="w-full px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:border-indigo-400"
      >
        <option value="" disabled>Sélectionnez une UE</option>
        <option v-for="ue in availableUes" :key="ue.ue" :value="ue.ue">
          {{ ue.ue }}
        </option>
      </select>
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