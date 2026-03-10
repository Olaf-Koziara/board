"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import Column from './Column'
import TaskCard from './TaskCard'
import AIPlanner from './AIPlanner'
import InviteModal from './InviteModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface BoardProps {
  boardId: string
  initialColumns: any[]
  initialTasks: any[]
}

export default function Board({ boardId, initialColumns, initialTasks }: BoardProps) {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTask, setActiveTask] = useState<any>(null)
  const supabase = createClient()
  const t = useTranslations('Board')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const channel = supabase
      .channel(`board-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `board_id=eq.${boardId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? payload.new : t))
            )
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id === payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId, supabase])

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveTask(tasks.find((t) => t.id === active.id))
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === 'Task'
    const isOverATask = over.data.current?.type === 'Task'

    if (!isActiveATask) return

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)

        if (tasks[activeIndex].column_id !== tasks[overIndex].column_id) {
          const updatedTasks = [...tasks]
          updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], column_id: tasks[overIndex].column_id }
          return arrayMove(updatedTasks, activeIndex, overIndex)
        }

        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverAColumn = over.data.current?.type === 'Column'
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        if (tasks[activeIndex].column_id !== overId) {
          const updatedTasks = [...tasks]
          updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], column_id: overId as string }
          return arrayMove(updatedTasks, activeIndex, activeIndex)
        }
        return tasks
      })
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (activeTask) {
      await supabase
        .from('tasks')
        .update({
          column_id: activeTask.column_id,
          position: tasks.filter(t => t.column_id === activeTask.column_id).findIndex((t) => t.id === active.id),
        })
        .eq('id', activeTask.id)
    }
  }

  return (
    <div className="flex flex-col h-full gap-8 p-8 overflow-hidden bg-white/50">
      <div className="flex justify-between items-center max-w-[1400px] mx-auto w-full">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">Sprint Board</h2>
        <div className="flex gap-3">
          <InviteModal boardId={boardId} />
          <Button className="gap-2 rounded-full px-6">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full mb-4">
        {columns.length > 0 && (
          <AIPlanner boardId={boardId} columnId={columns.sort((a,b) => a.position - b.position)[0].id} />
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-8 overflow-x-auto pb-8 max-w-[1400px] mx-auto w-full h-full">
          {columns.sort((a,b) => a.position - b.position).map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((t) => t.column_id === col.id).sort((a,b) => a.position - b.position)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard task={activeTask} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
