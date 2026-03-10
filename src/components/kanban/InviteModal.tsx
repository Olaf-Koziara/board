"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, Loader2 } from 'lucide-react'
import { inviteMember } from '@/actions/members'
import { useTranslations } from 'next-intl'

interface InviteModalProps {
  boardId: string
}

export default function InviteModal({ boardId }: InviteModalProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const t = useTranslations('Board')

  const handleInvite = async () => {
    if (!email) return
    setLoading(true)
    setMessage('')
    try {
      await inviteMember(boardId, email)
      setEmail('')
      setIsOpen(false)
      alert("Invitation sent successfully!")
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 rounded-full border-gray-200"
      >
        <UserPlus className="w-4 h-4" />
        {t('invite')}
      </Button>
    )
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="user@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 rounded-full"
      />
      <Button onClick={handleInvite} disabled={loading} className="rounded-full">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Invite"}
      </Button>
      <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-full">
        Cancel
      </Button>
      {message && <p className="absolute mt-12 text-xs text-red-500">{message}</p>}
    </div>
  )
}
