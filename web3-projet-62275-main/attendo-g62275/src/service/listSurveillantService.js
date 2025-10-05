import { supabase } from '@/lib/supabase/supabaseClient'

export const getAllSurveillants = async () => {
  const { data, error } = await supabase
    .from('teacher')
    .select('acro, names')
    .order('names')

  if (error) {
    console.error('Erreur lors de la récupération des surveillants:', error)
    throw error
  }

  return data
}

