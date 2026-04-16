'use client'

import * as React from 'react'
import { MOCK_TEACHERS } from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { CollaborationModal } from '@/components/dashboard/collaboration-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap } from 'lucide-react'
import { useViewerRole } from '@/hooks/use-viewer-role'

export default function MentorConnectPage() {
  const { role, loading: roleLoading } = useViewerRole()
  const [skillFilter, setSkillFilter] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [mentorOpen, setMentorOpen] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = MOCK_TEACHERS.filter((t) => {
    if (!skillFilter.trim()) return true
    const q = skillFilter.toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      t.expertise.toLowerCase().includes(q) ||
      t.skills.some((s) => s.toLowerCase().includes(q))
    )
  })

  if (loading || roleLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (role !== 'student') {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardHeader>
          <CardTitle>Mentor Connect</CardTitle>
          <CardDescription>
            This area is for students to discover teachers. Switch to a student account or
            browse <a className="text-primary underline" href="/dashboard/explore">Explore</a>.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="size-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Mentor Connect
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Find teachers who match your skills. Requests use the mentorship pipeline (
            <code className="rounded bg-muted px-1 text-xs">POST /api/requests</code>).
          </p>
        </div>
      </div>

      <div className="max-w-md space-y-2">
        <Label htmlFor="skill-filter">Filter by skill or name</Label>
        <Input
          id="skill-filter"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          placeholder="e.g. ROS 2, Controls, BVLOS"
          className="rounded-xl"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No mentors match that filter. Try another skill.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <Card
              key={t.id}
              className="rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{t.name}</CardTitle>
                    <RoleBadge role="teacher" className="mt-2" />
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {t.expertise}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground">{t.experience}</p>
                <div className="flex flex-wrap gap-2">
                  {t.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full rounded-full"
                  onClick={() => setMentorOpen(true)}
                >
                  Ask for Mentorship
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CollaborationModal
        open={mentorOpen}
        onOpenChange={setMentorOpen}
        title="Request mentorship"
        defaultType="mentorship"
      />
    </div>
  )
}
