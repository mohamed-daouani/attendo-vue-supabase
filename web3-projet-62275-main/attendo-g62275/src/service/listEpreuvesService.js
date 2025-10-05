import { supabase } from '../lib/supabase/supabaseClient.js'

export async function getEpreuvesByUe(sessionCompoId) {
    const { data, error } = await supabase
        .from('event')
        .select('*')
        .eq('session_compo', sessionCompoId)

    if (error) {
        console.error('Erreur lors de la récupération des épreuves :', error.message)
        return []
    }

    return data
}

export async function addEpreuve(sessionCompoId, epreuve) {
    const { data, error } = await supabase
        .from('event')
        .insert([{
            session_compo: sessionCompoId,
            label: epreuve.intitule,
        }])
        .select()

    if (error) {
        console.error('Erreur lors de l\'ajout de l\'épreuve :', error.message)
        return null
    }

    return data[0]
}

export async function getEpreuveById(epreuveId) {
    const { data, error } = await supabase
        .from('event')
        .select('label')
        .eq('id', epreuveId)
        .single()
    if (error) {
        console.error('Erreur lors de la récupération de l\'épreuve :', error.message)
        return null
    }
    return data
}
