'use client'

import * as React from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MOCK_PROJECT_FEED, MOCK_ME } from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { CollaborationModal } from '@/components/dashboard/collaboration-modal'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Heart, MessageCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

export default function DashboardPage() {
  const [userName, setUserName] = React.useState(MOCK_ME.name)
  const [userRole, setUserRole] = React.useState(MOCK_ME.role)
  const [loading, setLoading] = React.useState(true)
  const [collabOpen, setCollabOpen] = React.useState(false)
  const [collabDefault, setCollabDefault] = React.useState<'mentorship' | 'collaboration'>(
    'collaboration',
  )
  const [liked, setLiked] = React.useState<Record<string, boolean>>({})

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
          if (typeof meta?.name === 'string') setUserName(meta.name)
          if (meta?.role === 'student' || meta?.role === 'teacher' || meta?.role === 'company') {
            setUserRole(meta.role)
          }
        }
      } catch {
        /* mock client */
      } finally {
        await new Promise((r) => setTimeout(r, 450))
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-5 w-48 rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="flex flex-row gap-3 space-y-0">
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded-lg" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-5 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const feed = MOCK_PROJECT_FEED

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 shadow-sm md:p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              {userName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RoleBadge role={userRole} />
              <span className="text-sm text-muted-foreground">
                · {MOCK_ME.headline}
              </span>
            </div>
          </div>
          <Button
            className="shrink-0 rounded-full"
            onClick={() => {
              setCollabDefault('collaboration')
              setCollabOpen(true)
            }}
          >
            New collaboration
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Home feed</h2>
            <p className="text-xs text-muted-foreground">
              Each card is a project — like LinkedIn posts, built for repos.
            </p>
          </div>
        </div>

        {feed.length === 0 ? (
          <Empty className="rounded-2xl border border-dashed">
            <EmptyHeader>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyDescription>
                Follow projects and mentors to build your feed.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          feed.map((post) => {
            const askMentor = userRole === 'student' && post.author.role === 'teacher'
            return (
            <Card
              key={post.id}
              className="overflow-hidden rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row gap-3 space-y-0 pb-3">
                <Avatar className="size-11">
                  <AvatarFallback className="text-xs font-semibold">
                    {post.author.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold leading-none">{post.author.name}</p>
                    <RoleBadge role={post.author.role} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    @{post.author.handle} · {post.timestamp}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {post.author.headline}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pb-2">
                <h3 className="text-base font-semibold leading-snug">
                  <Link
                    href={`/dashboard/projects/${encodeURIComponent(post.projectSlug)}`}
                    className="text-primary hover:underline"
                  >
                    {post.projectTitle}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-wrap items-center gap-2 border-t border-border/60 bg-muted/20 px-4 py-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'rounded-full gap-1.5',
                    liked[post.id] && 'text-rose-600 dark:text-rose-400',
                  )}
                  onClick={() =>
                    setLiked((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                  }
                >
                  <Heart
                    className={cn('size-4', liked[post.id] && 'fill-current')}
                  />
                  {post.likes + (liked[post.id] ? 1 : 0)}
                </Button>
                <Button type="button" variant="ghost" size="sm" className="rounded-full gap-1.5">
                  <MessageCircle className="size-4" />
                  {post.comments}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="ml-auto rounded-full gap-1.5"
                  onClick={() => {
                    setCollabDefault(askMentor ? 'mentorship' : 'collaboration')
                    setCollabOpen(true)
                  }}
                >
                  <Users className="size-4" />
                  {askMentor ? 'Ask for Mentorship' : 'Collaborate'}
                </Button>
              </CardFooter>
            </Card>
            )
          })
        )}
      </section>

      <CollaborationModal
        open={collabOpen}
        onOpenChange={setCollabOpen}
        defaultType={collabDefault}
      />
    </div>
  )
}
