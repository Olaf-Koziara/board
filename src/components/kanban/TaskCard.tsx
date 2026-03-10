"use client"

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: any
}

export default function TaskCard({ task }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 h-[100px] min-h-[100px] border-2 border-dashed border-gray-300 rounded-[16px] bg-gray-50"
      />
    )
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200 border-none rounded-[16px] shadow-sm bg-white"
    >
      <CardContent className="p-4">
        <h4 className="font-medium text-gray-900 line-clamp-2">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-gray-500 mt-2 line-clamp-3">{task.description}</p>
        )}
      </CardContent>
    </Card>
  )
}
