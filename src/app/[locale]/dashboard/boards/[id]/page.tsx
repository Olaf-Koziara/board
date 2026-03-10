import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Board from '@/components/kanban/Board'

export default async function BoardPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
  const { id, locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${locale}`)

  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', id)
    .single()

  if (!board) notFound()

  const { data: columns } = await supabase
    .from('columns')
    .select('*')
    .eq('board_id', id)

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('board_id', id)

  return (
    <main className="h-screen bg-white">
      <Board
        boardId={id}
        initialColumns={columns || []}
        initialTasks={tasks || []}
      />
    </main>
  )
}
