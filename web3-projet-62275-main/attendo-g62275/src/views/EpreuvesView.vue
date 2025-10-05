<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import AddEpreuveForm from '@/components/AddEpreuveForm.vue'
import { getSessionById } from '@/service/listSessionsService.js'
import { getUEs, getUeBySessionId } from '@/service/listUeService.js'
import { getEpreuvesByUe } from '@/service/listEpreuvesService.js'

const route = useRoute()
const router = useRouter()
const epreuves = ref([])
const session = ref(null)
const ue = ref(null)
const sessionCompoId = ref(null)
const error = ref(null)
const loading = ref(false)

const breadcrumbPages = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'sessions', to: '/sessions' },
  { label: 'session', to: `/sessions/${route.params.sessionId}` },
  { label: 'ue', to: null }
])

const epreuvesTries = computed(() =>
  [...epreuves.value].sort((a, b) => (a.intitule || a.label).localeCompare(b.intitule || b.label))
)

const handleEpreuveAdded = async () => {
  await loadEpreuves()
}

const loadSessionAndUe = async () => {
  loading.value = true
  error.value = null
  try {
    session.value = await getSessionById(route.params.sessionId)
    const ues = await getUEs()
    ue.value = ues.find(u => u.ue === route.params.ueId)
    const sessionCompos = await getUeBySessionId(route.params.sessionId)
    const found = sessionCompos.find(sc => sc.ue === route.params.ueId)
    sessionCompoId.value = found ? found.id : null
  } catch (e) {
    error.value = "Erreur lors du chargement de la session ou de l'UE"
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadEpreuves = async () => {
  loading.value = true
  error.value = null
  try {
    if (!sessionCompoId.value) {
      epreuves.value = []
      return
    }
    epreuves.value = await getEpreuvesByUe(sessionCompoId.value)
  } catch (e) {
    error.value = "Erreur lors du chargement des épreuves"
    console.error(e)
  } finally {
    loading.value = false
  }
}

function navigateToLocaux(epreuve) {
  router.push({
    name: 'locaux-epreuve',
    params: {
      sessionId: route.params.sessionId,
      ueId: route.params.ueId,
      epreuveId: epreuve.id
    }
  })
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    await loadSessionAndUe()
    await loadEpreuves()
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
        <h2 class="text-3xl text-indigo-900">Liste des épreuves de {{ ue?.label || route.params.ueId }} (session : {{ session?.label || route.params.sessionId }})</h2>
      </div>

      <div v-if="epreuves.length > 0" class="mt-3 flex flex-row flex-wrap gap-3 justify-center">
        <div
          v-for="epreuve in epreuvesTries"
          :key="epreuve.id"
          class="bg-gray-100 rounded-lg shadow p-4 hover:shadow-lg transition-all duration-200 cursor-pointer max-w-[150px] w-full min-h-[180px] flex flex-col justify-between items-center"
          @click="navigateToLocaux(epreuve)"
        >
          <h3 class="text-lg font-bold text-indigo-900 mb-2">{{ epreuve.intitule || epreuve.label }}</h3>
          <div class="flex gap-1 mt-2 justify-center">
            <div v-if="epreuve.bilan" class="w-20 bg-white rounded-lg shadow text-center font-bold py-8 flex items-center justify-center">Bilan</div>
            <div v-if="epreuve.projet" class="w-20 bg-white rounded-lg shadow text-center font-bold py-8 flex items-center justify-center">Projet</div>
            <div v-if="epreuve.examen" class="w-20 bg-white rounded-lg shadow text-center font-bold py-8 flex items-center justify-center">Examen</div>
          </div>
        </div>
      </div>
      <AddEpreuveForm
        v-if="sessionCompoId"
        :session-compo-id="sessionCompoId"
        @epreuve-added="handleEpreuveAdded"
      />
    </div>
  </main>
</template>
