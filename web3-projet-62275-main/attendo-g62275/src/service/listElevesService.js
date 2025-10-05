import { supabase } from '@/lib/supabase/supabaseClient'

export const getElevesByUe = async (ueId) => {
    const { data, error } = await supabase
        .from('pae')
        .select('student_id, group, student:student (firstname, lastname), ue')
        .eq('ue', ueId)
    if (error) {
        console.error('Erreur lors de la récupération des élèves par UE:', error)
        throw error
    }
    return data
}

export const getElevesWithGroup = async (ue) => {
    const { data, error } = await supabase
        .from('pae')
        .select('student_id, group, student:student (firstname, lastname), ue')
        .eq('ue', ue)
    if (error) {
        console.error('Erreur lors de la récupération des groupes élèves:', error)
        throw error
    }
    return data
}

export const loadPresents = async (localId) => {
    const { data } = await supabase
        .from('examination')
        .select('student')
        .eq('examination_room', localId)
    return new Set(data ? data.map(e => e.student) : [])
}

export const ajoutPresent = async (student_id, localId) => {
    await supabase
        .from('examination')
        .insert([{ student: student_id, examination_room: localId }])
}

export const supprimerPresent = async (student_id, localId) => {
    await supabase
        .from('examination')
        .delete()
        .eq('student', student_id)
        .eq('examination_room', localId)
}

export const getRoomCapacity = async (localId) => {
    const { data, error } = await supabase
        .from('room')
        .select('capacity')
        .eq('label', localId)
        .single()
    if (error) {
        console.error('Erreur lors de la récupération de la capacité de la salle:', error)
        throw error
    }
    return data ? data.capacity : null
}

export const getExaminationRoomId = async (roomLabel, eventId) => {
    const { data, error } = await supabase
        .from('examination_room')
        .select('id')
        .eq('room', roomLabel)
        .eq('event', eventId)
        .single()

    if (error) {
        console.error('Erreur lors de la récupération de l\'ID de la salle d\'examen:', error)
        throw error
    }
    return data?.id
}

export async function setStudentPresence(roomLabel, studentId, present, eventId) {
    try {
        const examinationRoomId = await getExaminationRoomId(roomLabel, eventId)
        if (!examinationRoomId) {
            throw new Error('Salle d\'examen non trouvée')
        }

        if (present) {
            const { error } = await supabase
                .from('examination')
                .insert([{ student: studentId, examination_room: examinationRoomId }], { upsert: false })
            if (error && error.code !== '23505') throw error
        } else {
            const { error } = await supabase
                .from('examination')
                .delete()
                .eq('student', studentId)
                .eq('examination_room', examinationRoomId)
            if (error) throw error
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la présence:', error)
        throw error
    }
}

export const setRoomSupervisor = async (roomLabel, eventId, supervisorId) => {
    const { data, error } = await supabase
        .from('examination_room')
        .update({ supervisor: supervisorId })
        .eq('room', roomLabel)
        .eq('event', eventId)
    if (error) {
        console.error('Erreur lors de la sauvegarde du surveillant:', error)
        throw error
    }
    return data
}

export const getRoomSupervisor = async (roomLabel, eventId) => {
    const { data, error } = await supabase
        .from('examination_room')
        .select('supervisor')
        .eq('room', roomLabel)
        .eq('event', eventId)
        .single()
    if (error) {
        console.error('Erreur lors de la récupération du surveillant:', error)
        throw error
    }
    return data?.supervisor
}

export const getStudentsExamination = async (roomLabel, eventId) => {
    const { data: roomData, error: roomError } = await supabase
        .from('examination_room')
        .select('id')
        .eq('room', roomLabel)
        .eq('event', eventId)
        .single()

    if (roomError) {
        console.error("Erreur lors de la récupération de l'id de la salle d'examen:", roomError)
        throw roomError
    }

    const examinationRoomId = roomData?.id
    if (!examinationRoomId) return []

    const { data, error } = await supabase
        .from('examination')
        .select('student')
        .eq('examination_room', examinationRoomId)

    if (error) {
        console.error("Erreur lors de la récupération des étudiants présents:", error)
        throw error
    }
    return data.map(e => e.student)
}
