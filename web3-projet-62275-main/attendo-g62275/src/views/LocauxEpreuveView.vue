<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAllLocauxByEpreuveId, getLocauxDisponibles, ajouterLocalAEpreuve } from '@/service/listLocauxService.js'
import { getUEs } from '@/service/listUeService.js'
import { getEpreuveById } from '@/service/listEpreuvesService.js'
import { getStudentsExamination, getElevesByUe } from '@/service/listElevesService.js'
import Breadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()
const epreuveId = route.params.epreuveId
const ueId = route.params.ueId
const locaux = ref([])
const locauxDisponibles = ref([])
const localSelectionne = ref('')
const epreuveLabel = ref('')
const ueLabel = ref('')
const presentsParLocal = ref({})
const error = ref(null)
const loading = ref(false)

const loadLocaux = async () => {
  loading.value = true
  error.value = null
  try {
    const locauxList = await getAllLocauxByEpreuveId(epreuveId)
    locaux.value = locauxList
    const elevesUe = await getElevesByUe(ueId)
    const elevesUeIds = elevesUe.map(e => e.student_id)
    const presentsObj = {}
    for (const local of locauxList) {
      const presents = await getStudentsExamination(local.label, epreuveId)
      const presentsFiltres = presents.filter(id => elevesUeIds.includes(id))
      presentsObj[local.label] = presentsFiltres.length
    }
    presentsParLocal.value = presentsObj
  } catch (e) {
    error.value = "Erreur lors du chargement des locaux"
    console.error(e)
  } finally {
    loading.value = false
  }
}
const loadLocauxDisponibles = async () => {
  loading.value = true
  error.value = null
  try {
    locauxDisponibles.value = await getLocauxDisponibles(epreuveId)
  } catch (e) {
    error.value = "Erreur lors du chargement des locaux disponibles"
    console.error(e)
  } finally {
    loading.value = false
  }
}
const ajouterLocal = async () => {
  if (!localSelectionne.value) return
  loading.value = true
  error.value = null
  try {
    await ajouterLocalAEpreuve(epreuveId, localSelectionne.value)
    localSelectionne.value = ''
    await loadLocaux()
    await loadLocauxDisponibles()
  } catch (e) {
    error.value = "Erreur lors de l'ajout du local"
    console.error(e)
  } finally {
    loading.value = false
  }
}

const chargerLabelUe = async () => {
  loading.value = true
  error.value = null
  try {
    const ues = await getUEs()
    const ue = ues.find(u => u.ue === ueId)
    ueLabel.value = ue?.label || ueId
  } catch (e) {
    error.value = "Erreur lors du chargement de l'UE"
    console.error(e)
  } finally {
    loading.value = false
  }
}

const chargerLabelEpreuve = async () => {
  loading.value = true
  error.value = null
  try {
    const ep = await getEpreuveById(epreuveId)
    epreuveLabel.value = ep?.label || epreuveId
  } catch (e) {
    error.value = "Erreur lors du chargement de l'épreuve"
    console.error(e)
  } finally {
    loading.value = false
  }
}

const locauxTries = computed(() =>
  [...locaux.value].sort((a, b) => a.label.localeCompare(b.label))
)

const locauxDisponiblesTries = computed(() =>
  [...locauxDisponibles.value].sort((a, b) => a.label.localeCompare(b.label))
)

const breadcrumbPages = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'sessions', to: '/sessions' },
  { label: 'session', to: `/sessions/${route.params.sessionId}` },
  { label: 'ue', to: `/sessions/${route.params.sessionId}/ue/${ueId}` },
  { label: 'épreuve', to: null }
])

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await loadLocaux()
    await loadLocauxDisponibles()
    await chargerLabelUe()
    await chargerLabelEpreuve()
  } catch (e) {
    error.value = "Erreur lors du chargement initial"
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="container mx-auto p-6">
    <Breadcrumb :pages="breadcrumbPages" />
    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">{{ error }}</div>
    <div v-if="loading" class="mb-4 text-blue-700 text-center">Chargement…</div>
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center mb-6">
        <h2 class="text-3xl text-blue-900">Liste des locaux pour <span class="text-blue-900 font-bold">{{ epreuveLabel }} - {{ ueLabel }}</span></h2>
      </div>
      <div class="flex flex-row flex-wrap gap-4 mb-8 justify-center">
        <div
          v-for="local in locauxTries"
          :key="local.label"
          class="bg-white border-2 border-gray-400 rounded-lg shadow p-4 min-w-[140px] max-w-[180px] flex flex-col items-center cursor-pointer hover:border-blue-500 transition-all duration-200"
          @click="$router.push(`/sessions/${route.params.sessionId}/ue/${ueId}/epreuve/${epreuveId}/local/${local.label}`)"
        >
          <div class="text-xl font-bold mb-1">{{ local.label }}</div>
          <div class="text-blue-700 border-2 border-blue-400 rounded-full px-3 py-1 text-sm font-bold mb-2">
            {{ presentsParLocal[local.label] || 0 }} / {{ local.capacity }}
          </div>
          <div class="font-bold">Surveillant <span class="font-normal">{{ local.supervisor }}</span></div>
        </div>
      </div>
      <form @submit.prevent="ajouterLocal" class="bg-white rounded-lg shadow p-4 flex flex-row items-center gap-4 max-w-xl mx-auto">
        <label class="font-bold">Local</label>
        <select v-model="localSelectionne" class="border rounded px-2 py-1">
          <option value="" disabled>Choisissez un local</option>
          <option v-for="local in locauxDisponiblesTries" :key="local.label" :value="local.label">{{ local.label }}</option>
        </select>
        <button type="submit" class="border border-indigo-600 text-indigo-800 hover:bg-indigo-800 hover:text-white px-4 py-2 rounded transition-all duration-200">Ajouter</button>
      </form>
    </div>
  </main>
</template>
