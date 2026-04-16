'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { apiClient } from '@/lib/api-client'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, MapPin } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  bio?: string
  skills: string[]
  projects: any[]
}

function ProfileContent() {
  const searchParams = useSearchParams()
  const userIdFromQuery = searchParams.get('id')
  
  const [user, setUser] = React.useState<User | null>(null)
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [isEditing, setIsEditing] = React.useState(false)

  React.useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser) as User)
    }

    const fetchProfile = async () => {
      try {
        const id = userIdFromQuery || (storedUser ? JSON.parse(storedUser).id : null)
        if (!id) return
        const data = await apiClient.get<User>(`/api/users/${id}`)
        setUser(data)
      } catch (error) {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userIdFromQuery])

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newName = formData.get('name') as string
    const bio = formData.get('bio') as string
    const skillsInput = formData.get('skills') as string
    
    const data = {
      name: newName,
      bio,
      skills: skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    try {
      const updatedUser = await apiClient.put<User>('/api/users/update', data)
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser)
      setCurrentUser(updatedUser)
      localStorage.setItem('dronehub_user', JSON.stringify(updatedUser))
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleConnect = async () => {
    if (!user) return
    try {
      await apiClient.post('/api/connect', { receiverId: user.id })
      toast.success('Connection request sent!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send connection request')
    }
  }

  if (loading) return <ProfileLoading />
  if (!user) return <div className="p-8 text-center">User not found</div>

  const isOwnProfile = !userIdFromQuery || currentUser?.id === user.id

  return (
    <div className="-mx-4 space-y-6 md:-mx-8">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-violet-500/20 md:h-48">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
      </div>

      <div className="relative px-4 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="-mt-16 size-28 border-4 border-background shadow-xl ring-1 ring-border/80 sm:-mt-20 sm:size-32">
              <AvatarImage src={user.avatar} alt="" />
              <AvatarFallback className="text-2xl font-bold">
                {user.name ? user.name.slice(0, 2).toUpperCase() : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {user.name}
                </h1>
                <RoleBadge role={user.role ? user.role.toLowerCase() : 'student'} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">@{user.email ? user.email.split('@')[0] : 'user'}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {isOwnProfile ? (
              <Button className="rounded-full" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            ) : (
              <>
                <Button className="rounded-full" onClick={handleConnect}>Connect</Button>
                {currentUser?.role === 'STUDENT' && user.role === 'TEACHER' && (
                  <Button className="rounded-full" variant="secondary">
                    Request Mentorship
                  </Button>
                )}
                <Button variant="outline" className="rounded-full">
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <Card className="mt-6 rounded-2xl border-primary/20 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" name="skills" defaultValue={user.skills ? user.skills.join(', ') : ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={user.bio || ''}
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 rounded-2xl border border-border/80 bg-card/50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{user.bio || 'No bio provided yet.'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills && user.skills.map((s: string) => (
              <span
                key={s}
                className="rounded-full border border-border/80 bg-muted/50 px-3 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="h-auto w-full justify-start gap-1 rounded-2xl bg-muted/40 p-1">
            <TabsTrigger value="projects" className="rounded-xl">
              Projects
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-xl">
              Activity
            </TabsTrigger>
            <TabsTrigger value="connections" className="rounded-xl">
              Connections
            </TabsTrigger>
          </TabsList>
          <TabsContent value="projects" className="mt-6 space-y-4">
            {!user.projects || user.projects.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No public projects yet.
                </CardContent>
              </Card>
            ) : (
              user.projects.map((repo: any) => (
                <Card
                  key={repo.id}
                  className="rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-2">
                        <Link
                          href={`/dashboard/projects/${repo.id}`}
                          className="text-lg font-semibold text-primary hover:underline"
                        >
                          {repo.title}
                        </Link>
                        <CardDescription className="text-sm leading-relaxed">
                          {repo.description}
                        </CardDescription>
                      </div>
                      <div className="flex shrink-0 gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="size-4" />
                          {repo.starsCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="activity" className="mt-6">
            <Card className="rounded-2xl border-border/80">
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                Activity feed coming soon.
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="connections" className="mt-6">
            <ConnectionsTab userId={user.id} isOwnProfile={isOwnProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ConnectionsTab({ userId, isOwnProfile }: { userId: string, isOwnProfile: boolean }) {
  const [connections, setConnections] = React.useState<any[]>([])
  const [pending, setPending] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetchConnections()
  }, [userId])

  const fetchConnections = async () => {
    try {
      const data = await apiClient.get<any>(`/api/connect`)
      setConnections(data.connections || [])
      
      if (isOwnProfile) {
        const pendingData = await apiClient.get<any>(`/api/connect?type=pending`)
        setPending(pendingData.requests || [])
      }
    } catch (error) {
      toast.error('Failed to load connections')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await apiClient.patch(`/api/connect/${requestId}`, { status })
      toast.success(`Connection ${status.toLowerCase()}`)
      fetchConnections()
    } catch (error) {
      toast.error('Failed to update connection')
    }
  }

  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-6">
      {isOwnProfile && pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-primary">Pending Requests</h3>
          {pending.map((req) => (
            <Card key={req.id} className="rounded-xl border-primary/20 bg-primary/5">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={req.sender.avatar} />
                    <AvatarFallback>{req.sender.name ? req.sender.name.slice(0, 2).toUpperCase() : '??'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{req.sender.name}</p>
                    <RoleBadge role={req.sender.role ? req.sender.role.toLowerCase() : 'student'} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-full" onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}>Accept</Button>
                  <Button size="sm" variant="ghost" className="rounded-full" onClick={() => handleUpdateStatus(req.id, 'REJECTED')}>Decline</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Connections</h3>
        {connections.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-xl">No connections yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {connections.map((conn) => {
              const other = conn.senderId === userId ? conn.receiver : conn.sender
              if (!other) return null
              return (
                <Card key={conn.id} className="rounded-xl shadow-sm">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={other.avatar} />
                      <AvatarFallback>{other.name ? other.name.slice(0, 2).toUpperCase() : '??'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <Link href={`/dashboard/profile?id=${other.id}`} className="text-sm font-semibold hover:underline block truncate">
                        {other.name}
                      </Link>
                      <RoleBadge role={other.role ? other.role.toLowerCase() : 'student'} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="flex gap-4">
      <Skeleton className="h-28 w-28 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2 pt-8">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  )
}
