'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import { MOCK_ME } from '@/lib/mock/dashboard-data'
import type { AppRole } from '@/lib/role'
import { normalizeAppRole } from '@/lib/role'

export function useViewerRole() {
  const [role, setRole] = React.useState<AppRole>(MOCK_ME.role)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled && user) {
          const raw = (user.user_metadata as { role?: string } | undefined)?.role
          setRole(normalizeAppRole(raw))
        }
      } catch {
        setRole(MOCK_ME.role)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return { role, loading }
}
