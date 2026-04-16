'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export function useRealtimeSubscription(
  table: string,
  event: RealtimeEvent | RealtimeEvent[],
  callback: (payload: RealtimePostgresChangesPayload<any>) => void,
  filter?: string
) {
  useEffect(() => {
    const supabase = createClient()

    const events = Array.isArray(event) ? event : [event]
    const eventString = events.join(',')

    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: eventString as any,
          schema: 'public',
          table,
          filter,
        },
        callback
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, event, callback, filter])
}

export function useRealtimeNotifications(
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  return useRealtimeSubscription(
    'notifications',
    'INSERT',
    callback,
    `user_id=eq.${userId}`
  )
}

export function useRealtimeProjectUpdates(
  projectId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  return useRealtimeSubscription(
    'projects',
    ['INSERT', 'UPDATE'],
    callback,
    `id=eq.${projectId}`
  )
}

export function useRealtimeFeedUpdates(
  userId: string,
  callback: (payload: RealtimePostgresChangesPayload<any>) => void
) {
  return useRealtimeSubscription(
    'feed_items',
    'INSERT',
    callback,
    `user_id=eq.${userId}`
  )
}
