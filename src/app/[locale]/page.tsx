"use client"

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname, useRouter } from '@/i18n/routing'

export default function LandingPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) {
      setMessage(t('Auth.error'))
    } else {
      setMessage(t('Auth.success'))
    }
  }

  const toggleLocale = () => {
    const nextLocale = pathname.startsWith('/pl') ? 'en' : 'pl'
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale })
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-white">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" onClick={toggleLocale} disabled={isPending}>
          {pathname.startsWith('/pl') ? 'EN' : 'PL'}
        </Button>
      </div>

      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Secure Sprint
          </h1>
          <p className="text-lg text-gray-600">
            Minimalist Kanban for elite teams.
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-black/5">
          <CardHeader>
            <CardTitle>{t('Auth.login')}</CardTitle>
            <CardDescription>{t('Auth.emailLabel')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('Common.loading') : t('Auth.magicLink')}
              </Button>
            </form>
            {message && (
              <p className="mt-4 text-sm text-green-600 font-medium">
                {message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
