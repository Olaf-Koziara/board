"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function inviteMember(boardId: string, email: string) {
  const supabase = await createClient()

  // 1. Find profile by email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (profileError || !profile) {
    throw new Error("User not found. They must sign in to the app first.")
  }

  // 2. Add to board_members
  const { error: inviteError } = await supabase
    .from('board_members')
    .insert({ board_id: boardId, user_id: profile.id, role: 'member' })

  if (inviteError) {
    if (inviteError.code === '23505') throw new Error("User is already a member.")
    throw inviteError
  }

  revalidatePath(`/dashboard/boards/${boardId}`)
}
