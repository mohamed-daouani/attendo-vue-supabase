import { supabase } from '../lib/supabase/supabaseClient.js'

export async function getSession(){
    const { data, error } = await supabase
        .from('session')
        .select('*')

    if (error) {
        console.error('Erreur lors de la récupération des sessions :', error.message)
        return []
    }

    return data
}

export async function getSessionById(id) {
    const { data, error } = await supabase
        .from('session')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Erreur lors de la récupération de la session :', error.message)
        return null
    }

    return data
}

export async function addSession(sessionData){
    const { data, error } = await supabase
        .from('session')
        .insert([{ label: sessionData }])
        .select()

    if (error) {
        console.error('Erreur lors de l\'ajout de la session :', error.message)
        return null
    }

    return data[0]
}


