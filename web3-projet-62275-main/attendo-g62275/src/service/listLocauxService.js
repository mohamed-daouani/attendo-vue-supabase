import { supabase } from '../lib/supabase/supabaseClient.js'

export async function getAllLocauxByEpreuveId(epreuveId) {
  const { data, error } = await supabase
    .from('examination_room')
    .select('id, supervisor, room:room (label, capacity)')
    .eq('event', epreuveId)
  if (error) {
    console.error('Erreur lors de la récupération des locaux alloués :', error.message)
    return []
  }
  return data.map(item => ({
    id: item.id,
    supervisor: item.supervisor,
    label: item.room?.label,
    capacity: item.room?.capacity
  }))
}

export async function ajouterLocalAEpreuve(epreuveId, localId) {
  const { error } = await supabase
    .from('examination_room')
    .insert([{
      event: epreuveId,
      room: localId,
      supervisor: null
    }])
  if (error) {
    console.error("Erreur lors de l'ajout du local à l'épreuve :", error.message)
    return false
  }
  return true
}

export async function getLocauxDisponibles(epreuveId) {
  const { data: allLocaux, error: errorAll } = await supabase
    .from('room')
    .select('label, capacity')
  if (errorAll) {
    console.error('Erreur lors de la récupération de tous les locaux :', errorAll.message)
    return []
  }

  const { data: alloues, error: errorAlloues } = await supabase
    .from('examination_room')
    .select('room')
    .eq('event', epreuveId)
  if (errorAlloues) {
    console.error('Erreur lors de la récupération des locaux alloués :', errorAlloues.message)
    return allLocaux
  }

  const allouesIds = alloues ? alloues.map(l => l.room) : []
  return allLocaux
    .filter(l => !allouesIds.includes(l.label))
    .map(local => ({
      id: local.label,
      label: local.label,
      capacity: local.capacity
    }))
}
