"use server"

import Groq from 'groq-sdk'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function generateTasks(boardId: string, columnId: string, description: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const prompt = `
    You are an expert project manager. Break down the following sprint description into 5-8 actionable tasks.
    Sprint Description: ${description}
    Return only a JSON array of tasks, where each task is an object with "title" and "description" keys.
    Format: [{"title": "Task Title", "description": "Short description"}]
  `

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
  })

  const content = chatCompletion.choices[0]?.message?.content
  if (!content) throw new Error("AI failed to generate tasks")

  const { tasks } = JSON.parse(content)

  const tasksToInsert = tasks.map((task: any, index: number) => ({
    board_id: boardId,
    column_id: columnId,
    title: task.title,
    description: task.description,
    position: index,
    created_by: user.id
  }))

  const { error } = await supabase.from('tasks').insert(tasksToInsert)
  if (error) throw error

  revalidatePath(`/dashboard/boards/${boardId}`)
}
