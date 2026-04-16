'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getMockProject } from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { CollaborationModal } from '@/components/dashboard/collaboration-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Star, GitFork, Users, GitBranch } from 'lucide-react'
import { useViewerRole } from '@/hooks/use-viewer-role'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = typeof params.id === 'string' ? params.id : 'demo'
  const project = getMockProject(projectId)
  const { role: viewerRole } = useViewerRole()

  const [collabOpen, setCollabOpen] = React.useState(false)
  const [mentorOpen, setMentorOpen] = React.useState(false)

  const askMentorCta =
    viewerRole === 'student' && project.owner.role === 'teacher'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/projects" className="hover:text-foreground">
              Projects
            </Link>
            <span>/</span>
            <span className="font-mono text-foreground">{project.name}</span>
            <span className="rounded-md border border-border/80 px-1.5 py-0.5 text-xs">
              Public
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{project.name}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="size-4" />
              {project.stars.toLocaleString()} stars
            </span>
            <span className="flex items-center gap-1.5">
              <GitFork className="size-4" />
              {project.forks} forks
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="size-4" />
              default · {project.updatedAt}
            </span>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-56 lg:flex-col">
          <Button className="rounded-full" onClick={() => setCollabOpen(true)}>
            Collaborate
          </Button>
          {askMentorCta ? (
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => setMentorOpen(true)}
            >
              Ask for Mentorship
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs defaultValue="overview" className="min-w-0">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/40 p-1">
            <TabsTrigger value="overview" className="rounded-xl">
              Overview
            </TabsTrigger>
            <TabsTrigger value="code" className="rounded-xl">
              Code
            </TabsTrigger>
            <TabsTrigger value="readme" className="rounded-xl">
              README
            </TabsTrigger>
            <TabsTrigger value="contributors" className="rounded-xl">
              Contributors
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">About this project</CardTitle>
                <CardDescription>
                  Summary and metadata — mirrors GET /api/projects/:id in production.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-muted px-3 py-1 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
              <div className="border-b border-border/80 bg-muted/30 px-4 py-2 text-xs font-mono text-muted-foreground">
                src / autonomy / pipeline.ts
              </div>
              <CardContent className="p-0">
                <pre className="max-h-[420px] overflow-x-auto p-4 text-xs leading-relaxed md:text-sm">
                  <code>{`export function estimationLoop(state: EstimatorState) {
  const fused = ekf.predict(state.imu);
  return guardBorders(fused, state.corridor);
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="readme" className="mt-4">
            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardContent className="p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                  {project.readme}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="contributors" className="mt-4">
            <Card className="rounded-2xl border-border/80">
              <CardHeader>
                <CardTitle className="text-base">Contributors</CardTitle>
                <CardDescription>
                  Core people shipping features in the last 90 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.collaborators.map((c) => (
                  <div key={c.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                        {c.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <RoleBadge role={c.role} className="mt-1" />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">+{12 + c.name.length}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="font-medium">{project.owner.name}</p>
                <RoleBadge role={project.owner.role} className="mt-2" />
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Contributors</p>
                <p className="flex items-center gap-1.5 font-medium">
                  <Users className="size-4" />
                  {project.contributors}
                </p>
              </div>
            </CardContent>
          </Card>
          {askMentorCta ? (
            <Card className="rounded-2xl border-dashed border-violet-500/30 bg-violet-500/5">
              <CardContent className="p-4 text-sm">
                <p className="font-medium">Mentorship</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  This project owner is a teacher — students can request structured mentorship.
                </p>
                <Button
                  size="sm"
                  className="mt-3 w-full rounded-full"
                  variant="secondary"
                  onClick={() => setMentorOpen(true)}
                >
                  Ask for Mentorship
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>

      <CollaborationModal
        open={collabOpen}
        onOpenChange={setCollabOpen}
        title="Collaborate on this project"
        defaultType="collaboration"
      />
      <CollaborationModal
        open={mentorOpen}
        onOpenChange={setMentorOpen}
        title="Request mentorship"
        defaultType="mentorship"
      />
    </div>
  )
}
