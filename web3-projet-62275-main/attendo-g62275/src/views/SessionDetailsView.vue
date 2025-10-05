<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSessionById } from '../service/listSessionsService.js'
import { getUeBySessionId} from '../service/listUeService.js'
import Breadcrumb from '@/components/Breadcrumb.vue'
import BaseTable from '@/components/BaseTable.vue'
import AddUeForm from '@/components/AddUeForm.vue'

const route = useRoute()
const router = useRouter()
const session = ref(null)
const ue = ref([])
const columns = [
  { label: 'Nom', key: 'ue' }
]

const breadcrumbPages = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'sessions', to: '/sessions' },
  { label: 'session', to: null }
])

const ueTries = computed(() =>
  [...ue.value].sort((a, b) => a.ue.localeCompare(b.ue))
)

const navigateToUe = (ueItem) => {
  router.push(`/sessions/${route.params.id}/ue/${ueItem.ue}`)
}

const loadUes = async () => {
  try {
    const sessionId = route.params.id
    ue.value = await getUeBySessionId(sessionId)
  } catch (error) {
    console.error('Erreur lors du chargement des UE :', error)
  }
}

const handleUeAdded = async () => {
  await loadUes()
}

onMounted(async () => {
  try {
    const sessionId = route.params.id
    session.value = await getSessionById(sessionId)
    if (session.value) {
      await loadUes()
    }
  } catch (error) {
    console.error('Erreur lors du chargement des détails de la session :', error)
  }
})
</script>

<template>
  <main class="container mx-auto p-6">
    <Breadcrumb :pages="breadcrumbPages" />

    <div v-if="session" class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center mb-6">
        <h2 class="text-3xl text-indigo-900">Session&nbsp;</h2>
        <h2 class="text-3xl font-bold italic text-indigo-900">{{ session.label }}</h2>
      </div>

      <div v-if="ue.length > 0" class="mt-6">
        <BaseTable
          title="UE"
          :columns="columns"
          :data="ueTries"
        >
          <template #ue="{ item }">
            <div @click="navigateToUe(item)" class="cursor-pointer">
              {{ item.ue }}
            </div>
          </template>
        </BaseTable>
      </div>

      <AddUeForm
        :existing-ues="ue"
        :session-id="route.params.id"
        @ue-added="handleUeAdded"
      />
    </div>

    <div v-else class="text-center p-6">
      <p class="text-red-600">Session non trouvée</p>
    </div>
  </main>
</template>
