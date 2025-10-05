import { supabase } from '../lib/supabase/supabaseClient.js'

export async function getUEs(){
    const { data, error } = await supabase
        .from('ue')
        .select('*')
    
    if (error) {
        console.error('Erreur lors de la récupération des UEs :', error.message)
        return []
    }
    
    return data
}

export async function getUeBySessionId(sessionId) {
    const { data, error } = await supabase
        .from('session_compo')
        .select('*')
        .eq('session', sessionId)
    
    if (error) {
        console.error('Erreur lors de la récupération des UE :', error.message)
        return []
    }
    
    return data
}

export async function addUeToSession(sessionId, ueName) {
    const { data, error } = await supabase
        .from('session_compo')
        .insert([{ 
            session: sessionId,
            ue: ueName
        }])
        .select()
    
    if (error) {
        console.error('Erreur lors de l\'ajout de l\'UE :', error.message)
        return null
    }
    
    return data[0]
} 