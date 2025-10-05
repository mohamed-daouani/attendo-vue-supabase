<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { getAllSurveillants } from '@/service/listSurveillantService.js'
import { getElevesByUe, getRoomCapacity, setStudentPresence, setRoomSupervisor, getRoomSupervisor, getStudentsExamination } from '@/service/listElevesService.js'

const route = useRoute()
const ueId = route.params.ueId
const localId = route.params.localId
const eventId = route.params.epreuveId
const surveillantActuel = ref('')
const surveillants = ref([])
const surveillantSelectionne = ref('')
const etudiantsRaw = ref([])
const presents = ref(new Set())
const roomCapacity = ref(null)
const loading = ref(false)
const error = ref(null)
const presentCount = ref(0)

const etudiants = computed(() =>
  etudiantsRaw.value
    .filter(e => e.ue === ueId)
    .sort((a, b) => a.student.lastname.localeCompare(b.student.lastname))
)

const surveillantsTries = computed(() =>
  [...surveillants.value].sort((a, b) => a.names.localeCompare(b.names))
)

const breadcrumbPages = computed(() => [
  { label: 'Accueil', to: '/' },
  { label: 'sessions', to: '/sessions' },
  { label: 'session', to: `/sessions/${route.params.sessionId}` },
  { label: 'ue', to: `/sessions/${route.params.sessionId}/ue/${route.params.ueId}` },
  { label: 'épreuve', to: `/sessions/${route.params.sessionId}/ue/${route.params.ueId}/epreuve/${route.params.epreuveId}` },
  { label: 'local', to: null }
])

const loadSurveillants = async () => {
  try {
    loading.value = true;
    error.value = null;
    surveillants.value = await getAllSurveillants()
  } catch (err) {
    console.error('Erreur lors du chargement des surveillants:', err)
    error.value = 'Erreur lors du chargement des surveillants'
  } finally {
    loading.value = false;
  }
}

const loadEleves = async () => {
  try {
    loading.value = true;
    error.value = null;
    etudiantsRaw.value = await getElevesByUe(ueId)
  } catch (err) {
    console.error('Erreur lors du chargement des élèves:', err)
    error.value = 'Erreur lors du chargement des élèves'
  } finally {
    loading.value = false;
  }
}

const loadRoomCapacity = async () => {
  try {
    loading.value = true;
    error.value = null;
    roomCapacity.value = await getRoomCapacity(localId)
  } catch (err) {
    console.error('Erreur lors du chargement de la capacité:', err)
    error.value = 'Erreur lors du chargement de la capacité'
  } finally {
    loading.value = false;
  }
}

async function chargerSurveillantActuel() {
  try {
    loading.value = true;
    error.value = null;
    const supervisorId = await getRoomSupervisor(localId, eventId);
    surveillantActuel.value = supervisorId;
  } catch (err) {
    console.error('Erreur lors du chargement du surveillant:', err)
    error.value = 'Erreur lors du chargement du surveillant'
    surveillantActuel.value = '';
  } finally {
    loading.value = false;
  }
}

async function loadPresentsFromDB() {
  try {
    loading.value = true;
    error.value = null;
    const presentsList = await getStudentsExamination(localId, eventId);
    presents.value = new Set(presentsList);
    presentCount.value = presents.value.size;
  } catch (err) {
    console.error('Erreur lors du chargement des présences:', err)
    error.value = 'Erreur lors du chargement des présences'
    presents.value = new Set();
    presentCount.value = 0;
  } finally {
    loading.value = false;
  }
}

async function togglePresence(student_id) {
  if (loading.value) return;

  const isPresent = presents.value.has(student_id);
  if (!isPresent && presents.value.size >= roomCapacity.value) {
    error.value = "Capacité maximale atteinte pour ce local.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    if (isPresent) {
      presents.value.delete(student_id);
      await setStudentPresence(localId, student_id, false, eventId);
    } else {
      presents.value.add(student_id);
      await setStudentPresence(localId, student_id, true, eventId);
    }
    await loadPresentsFromDB();
  } catch (err) {
    error.value = err.message || "Erreur lors de la mise à jour de la présence";
    console.error(err);
    if (isPresent) {
      presents.value.add(student_id);
    } else {
      presents.value.delete(student_id);
    }
  } finally {
    loading.value = false;
  }
}

async function definirSurveillant() {
  if (!surveillantSelectionne.value) return;
  loading.value = true;
  error.value = null;
  try {
    await setRoomSupervisor(localId, eventId, surveillantSelectionne.value);
    await chargerSurveillantActuel();
    surveillantSelectionne.value = '';
  } catch (err) {
    error.value = "Erreur lors de la sauvegarde du surveillant";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    await Promise.all([
      loadSurveillants(),
      loadEleves(),
      loadRoomCapacity(),
      chargerSurveillantActuel(),
      loadPresentsFromDB()
    ]);
    presentCount.value = presents.value.size;
  } catch (err) {
    error.value = "Erreur lors du chargement des données";
    console.error(err);
  } finally {
    loading.value = false;
  }
})
</script>

<template>
  <main class="container mx-auto p-6">
    <Breadcrumb :pages="breadcrumbPages" />
    <div v-if="error" class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">{{ error }}</div>
    <div v-if="loading" class="mb-6 text-blue-700 text-center">Chargement…</div>
    <div class="bg-white rounded-2xl shadow-2xl p-8 mt-8">
      <h2 class="text-3xl text-blue-900 mb-10 font-light text-center">
        Prise de présence du local <span class="font-bold">{{ localId }}</span>
        <span v-if="surveillantActuel"> par <span class="font-bold">{{ surveillantActuel }}</span></span>
      </h2>

      <div class="mb-6 text-center text-lg">
        Présents : <span class="font-bold">{{ presentCount }}</span>
        <span v-if="roomCapacity"> / {{ roomCapacity }}</span>
      </div>

      <div class="flex items-center mb-12 max-w-2xl mx-auto">
        <div class="bg-blue-900 text-white rounded-l-lg h-12 px-6 flex items-center font-semibold border border-blue-900 border-r-0 text-base min-w-[120px] justify-center" style="font-family: inherit;">Surveillant</div>
        <select v-model="surveillantSelectionne"
          class="bg-blue-50 h-12 px-4 flex-1 border-t border-b border-blue-900 focus:outline-none text-base font-medium"
          style="font-family: inherit; min-width: 0; border-radius: 0;">
          <option value="" disabled>Choisir/modifier le surveillant</option>
          <option v-for="surveillant in surveillantsTries" :key="surveillant.acro" :value="surveillant.acro">
            {{ surveillant.acro }} - {{ surveillant.names }}
          </option>
        </select>
        <button
          class="rounded-r-lg h-12 border border-blue-900 border-l-0 px-6 bg-blue-900 text-white hover:bg-blue-700 font-semibold text-base transition-all duration-200 min-w-[140px] flex items-center justify-center"
          style="font-family: inherit;"
          @click="definirSurveillant">
          Définir le surveillant
        </button>
      </div>
      <div class="overflow-x-auto flex justify-center">
        <table class="min-w-[700px] max-w-3xl w-full rounded-2xl overflow-hidden shadow-lg text-base">
          <thead>
            <tr class="bg-blue-900 text-white">
              <th class="px-6 py-4 text-left font-semibold text-lg">Matricule</th>
              <th class="px-6 py-4 text-left font-semibold text-lg">Groupe</th>
              <th class="px-6 py-4 text-left font-semibold text-lg">Prénom</th>
              <th class="px-6 py-4 text-left font-semibold text-lg">Nom</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(etudiant, index) in etudiants"
              :key="etudiant.student_id"
              :class="[
                presents.has(etudiant.student_id)
                  ? 'bg-blue-200'
                  : index % 2 === 0
                    ? 'bg-white'
                    : 'bg-white',
                (presents.size >= roomCapacity && !presents.has(etudiant.student_id)) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              ]"
              @click="(presents.size < roomCapacity || presents.has(etudiant.student_id)) && togglePresence(etudiant.student_id)"
            >
              <td class="px-6 py-3">{{ etudiant.student_id }}</td>
              <td class="px-6 py-3">{{ etudiant.group }}</td>
              <td class="px-6 py-3">{{ etudiant.student.firstname }}</td>
              <td class="px-6 py-3">{{ etudiant.student.lastname }}</td>
              <td class="px-6 py-3 text-right">
                <span v-if="presents.has(etudiant.student_id)" class="text-blue-700 font-bold" title="Présent">✔️</span>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </main>
</template>

<style scoped>
select:disabled {
  color: #888;
  background: #f3f4f6;
}

th, td {
  font-family: inherit;
}
</style>

