"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBoard(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data, error } = await supabase
    .from('boards')
    .insert({ name, owner_id: user.id })
    .select()
    .single()

  if (error) throw error

  // Initialize default columns
  const defaultColumns = [
    { board_id: data.id, title: 'To Do', position: 1 },
    { board_id: data.id, title: 'In Progress', position: 2 },
    { board_id: data.id, title: 'Done', position: 3 },
  ]

  await supabase.from('columns').insert(defaultColumns)

  revalidatePath('/dashboard')
  return data
}
