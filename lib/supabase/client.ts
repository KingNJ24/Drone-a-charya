import { createBrowserClient } from '@supabase/ssr'

type MockAuthUser = {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

const MOCK_USER_KEY = 'drone_a_charya_mock_user'

const getStoredUser = (): MockAuthUser | null => {
  if (typeof window === 'undefined') return null
  const raw = window.localStorage.getItem(MOCK_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as MockAuthUser
  } catch {
    return null
  }
}

const setStoredUser = (user: MockAuthUser | null) => {
  if (typeof window === 'undefined') return
  if (!user) {
    window.localStorage.removeItem(MOCK_USER_KEY)
    return
  }
  window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(user))
}

const createMockClient = () => {
  const auth = {
    async signUp({
      email,
      options,
    }: {
      email: string
      password: string
      options?: { data?: Record<string, unknown> }
    }) {
      const user: MockAuthUser = {
        id: crypto.randomUUID(),
        email,
        user_metadata: options?.data || {},
      }
      setStoredUser(user)
      return { data: { user }, error: null }
    },
    async signInWithPassword({ email }: { email: string; password: string }) {
      const existing = getStoredUser()
      const user =
        existing && existing.email === email
          ? existing
          : { id: crypto.randomUUID(), email, user_metadata: { name: 'User', role: 'student' } }
      setStoredUser(user)
      return { data: { user }, error: null }
    },
    async getUser() {
      const user = getStoredUser()
      return { data: { user }, error: null }
    },
    async signOut() {
      setStoredUser(null)
      return { error: null }
    },
    async updateUser({ data }: { data: Record<string, unknown> }) {
      const user = getStoredUser()
      if (!user) return { data: { user: null }, error: new Error('No active user') }
      const updated = {
        ...user,
        user_metadata: {
          ...(user.user_metadata || {}),
          ...data,
        },
      }
      setStoredUser(updated)
      return { data: { user: updated }, error: null }
    },
  }

  return {
    auth,
    channel() {
      return {
        on() {
          return this
        },
        subscribe() {
          return { id: 'mock-channel' }
        },
      }
    },
    removeChannel() {
      return
    },
  }
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient() as any
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  )
}
