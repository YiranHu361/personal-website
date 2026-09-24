'use client'

import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ADMIN_UI_COOKIE } from '@/lib/adminAuth'

interface CounterState {
  configured: boolean
  total?: number
  today?: number
}

// Private badge: renders nothing unless this browser is signed in at /admin.
export default function ResumeCounter() {
  const [counter, setCounter] = useState<CounterState | null>(null)

  useEffect(() => {
    // Skip the request entirely for regular visitors
    if (!document.cookie.split('; ').includes(`${ADMIN_UI_COOKIE}=1`)) return

    const controller = new AbortController()
    fetch('/api/resume-stats', { signal: controller.signal, cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setCounter({ configured: Boolean(data.configured), total: data.total, today: data.today })
      })
      .catch(() => {})

    return () => controller.abort()
  }, [])

  if (!counter) return null

  return (
    <a
      href="/admin"
      title="Only visible to you"
      className="mt-4 inline-flex items-center gap-2 border border-dashed border-[#7209b7] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#7209b7] hover:bg-[#7209b7] hover:text-[#f8f9fa]"
    >
      <Download size={12} />
      {counter.configured
        ? `${counter.total ?? 0} resume downloads // ${counter.today ?? 0} today`
        : 'Resume counter not connected'}
    </a>
  )
}
