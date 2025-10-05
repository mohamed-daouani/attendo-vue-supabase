<template>
  <main class="container mx-auto p-6">
    <Breadcrumb :pages="breadcrumbPages"/>
    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">{{ error }}</div>
    <div v-if="loading" class="mb-4 text-blue-700 text-center">Chargement…</div>
    <h2 class="text-3xl font-bold mb-6 text-indigo-900">Sessions</h2>

    <BaseTable
      title="Sessions"
      :columns="columns"
      :data="sessionsTries"
    >
      <template #label="{ item }">
        <div @click="navigateToSession(item)" class="cursor-pointer">
          {{ item.label }}
        </div>
      </template>
    </BaseTable>
    <BaseForm @sessionAdded="handleSessionAdded"/>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getSession } from '../service/listSessionsService.js'
import BaseTable from '@/components/BaseTable.vue'
import BaseForm from '@/components/BaseForm.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

const router = useRouter()
const sessions = ref([])
const error = ref(null)
const loading = ref(false)
const columns = [
  { label: 'Nom', key: 'label' }
]

const breadcrumbPages = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'sessions', to: null }
])

const sessionsTries = computed(() =>
  [...sessions.value].sort((a, b) => a.label.localeCompare(b.label))
)

const navigateToSession = (session) => {
  router.push(`/sessions/${session.id}`)
}

const handleSessionAdded = (newSession) => {
  sessions.value = [...sessions.value, newSession]
}

onMounted(async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getSession()
    sessions.value = data
  } catch (e) {
    error.value = "Erreur lors du chargement des sessions"
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
