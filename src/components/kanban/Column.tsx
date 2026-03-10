"use client"

import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { cn } from '@/lib/utils'

interface ColumnProps {
  column: any
  tasks: any[]
}

export default function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-[350px] min-w-[350px] bg-gray-50/50 rounded-[24px] p-4 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <span className="bg-white px-2 py-0.5 rounded-full text-xs font-medium border border-gray-100 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-grow overflow-y-auto min-h-[200px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
