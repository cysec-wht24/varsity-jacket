import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://frjpcjuzsznenvhtqduj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyanBjanV6c3puZW52aHRxZHVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5ODQ2OTgsImV4cCI6MjA4OTU2MDY5OH0.1Bcx9a50P6hz2gHBiSEsimoXWuBiSt7-88Df4A1vUnQ'

export const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ THIS MUST BE EXPORTED
export async function saveUserData(payload: any) {
    const { error } = await supabase
        .from('user_data')
        .insert([{ data: payload }])

    if (error) {
        console.error('Supabase Insert Error:', error)
        return false
    }

    return true
}