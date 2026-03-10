"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Loader2 } from 'lucide-react'
import { generateTasks } from '@/actions/ai'
import { useTranslations } from 'next-intl'

interface AIPlannerProps {
  boardId: string
  columnId: string
}

export default function AIPlanner({ boardId, columnId }: AIPlannerProps) {
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('Board')

  const handleGenerate = async () => {
    if (!description) return
    setLoading(true)
    try {
      await generateTasks(boardId, columnId, description)
      setDescription('')
      setIsOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-[20px] border border-gray-100 mb-4">
      {!isOpen ? (
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full gap-2 rounded-xl"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          {t('aiGenerate')}
        </Button>
      ) : (
        <div className="space-y-3">
          <Input
            placeholder={t('aiDescribe')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={loading || !description}
              className="flex-grow"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {t('generate')}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
