'use client'

import * as React from 'react'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  MOCK_ACTIVITY,
  MOCK_ME,
  MOCK_MENTOR_PROFILE,
  MOCK_PROFILE_REPOS,
  type MockUser,
} from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, GitFork, Users } from 'lucide-react'
import Link from 'next/link'

const connectionRows = [
  { name: 'Aria Kovacs', role: 'student' as const, mutual: 12 },
  { name: 'Vertex Aerial', role: 'company' as const, mutual: 4 },
  { name: 'James Okonkwo', role: 'teacher' as const, mutual: 8 },
]

function ProfileContent() {
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const isMentorPreview = view === 'mentor'

  const [me, setMe] = React.useState<MockUser>(MOCK_ME)
  const [loading, setLoading] = React.useState(true)

  const profile: MockUser = isMentorPreview ? MOCK_MENTOR_PROFILE : me
  const showMentorshipCta =
    !isMentorPreview
      ? false
      : me.role === 'student' && profile.role === 'teacher'

  React.useEffect(() => {
    let cancelled = false
    const run = async () => {
      const supabase = createClient()
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled && user) {
          const meta = user.user_metadata as Record<string, unknown> | undefined
          const next: MockUser = {
            ...MOCK_ME,
            name: (typeof meta?.name === 'string' && meta.name) || MOCK_ME.name,
            email: user.email || undefined,
            role:
              meta?.role === 'teacher' || meta?.role === 'company' || meta?.role === 'student'
                ? meta.role
                : MOCK_ME.role,
            bio: typeof meta?.bio === 'string' ? meta.bio : MOCK_ME.bio,
            skills: Array.isArray(meta?.skills) ? (meta.skills as string[]) : MOCK_ME.skills,
          }
          setMe(next)
        }
      } catch {
        /* mock */
      } finally {
        await new Promise((r) => setTimeout(r, 350))
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <ProfileLoading />
  }

  return (
    <div className="-mx-4 space-y-6 md:-mx-8">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/30 via-secondary/20 to-violet-500/20 md:h-48">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
      </div>

      <div className="relative px-4 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="-mt-16 size-28 border-4 border-background shadow-xl ring-1 ring-border/80 sm:-mt-20 sm:size-32">
              <AvatarImage src={profile.avatarUrl} alt="" />
              <AvatarFallback className="text-2xl font-bold">
                {profile.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  {profile.name}
                </h1>
                <RoleBadge role={profile.role} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">@{profile.handle}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {profile.headline}
              </p>
              {profile.location && (
                <p className="mt-2 text-xs text-muted-foreground">{profile.location}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Button className="rounded-full" variant={isMentorPreview ? 'default' : 'outline'}>
              {isMentorPreview ? 'Connect' : 'Share profile'}
            </Button>
            {showMentorshipCta && (
              <Button className="rounded-full" variant="secondary">
                Request Mentorship
              </Button>
            )}
            <Button variant="outline" className="rounded-full">
              Message
            </Button>
          </div>
        </div>

        {!isMentorPreview && (
          <p className="mt-4 text-xs text-muted-foreground">
            Preview a mentor profile:{' '}
            <Link
              href="/dashboard/profile?view=mentor"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              view mentor layout
            </Link>
          </p>
        )}

        <div className="mt-8 rounded-2xl border border-border/80 bg-card/50 p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            About
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{profile.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border/80 bg-muted/50 px-3 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {!isMentorPreview && (
          <Card className="mt-6 rounded-2xl border-border/80 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold">Edit profile (sync)</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Updates your session metadata when using Supabase auth.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="p-bio">Bio</Label>
                  <Input
                    id="p-bio"
                    defaultValue={me.bio}
                    onBlur={async (e) => {
                      const supabase = createClient()
                      await supabase.auth.updateUser({
                        data: { bio: e.target.value },
                      })
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            {MOCK_PROFILE_REPOS.length === 0 ? (
              <Card className="rounded-2xl border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No public projects yet. Pin a repo from your workspace.
                </CardContent>
              </Card>
            ) : (
              MOCK_PROFILE_REPOS.map((repo) => (
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
                          {repo.name}
                        </Link>
                        <CardDescription className="text-sm leading-relaxed">
                          {repo.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {repo.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="size-4" />
                          {repo.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="size-4" />
                          {repo.forks}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-4" />
                          {repo.contributors}
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
              <CardContent className="divide-y divide-border/60 p-0">
                {MOCK_ACTIVITY.map((a, i) => (
                  <div key={a.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <p className="text-sm">{a.text}</p>
                    <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                    {i < MOCK_ACTIVITY.length - 1 ? null : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="connections" className="mt-6">
            <Card className="rounded-2xl border-border/80">
              <CardContent className="p-0">
                {connectionRows.map((c, i) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback>{c.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <RoleBadge role={c.role} className="mt-1" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {c.mutual} mutual
                      </span>
                    </div>
                    {i < connectionRows.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ProfileLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />
      <div className="flex gap-4">
        <Skeleton className="size-28 shrink-0 rounded-full" />
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
