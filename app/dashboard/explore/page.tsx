'use client'

import { Compass } from 'lucide-react'
import { MOCK_PROJECT_FEED, MOCK_SUGGESTED } from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent } from '@/components/ui/card'

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Explore</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Discover standout builders, fresh projects, and active collaboration signals across the drone ecosystem.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[2rem] border-border/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Trending tags</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['AI', 'Drone', 'Navigation', 'Simulation', 'ROS 2', 'Safety'].map((tag) => (
                <span key={tag} className="rounded-full border border-border/70 px-3 py-2 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-border/70">
          <CardContent className="space-y-4 p-6">
            <p className="text-sm font-semibold">Builders to follow</p>
            {MOCK_SUGGESTED.map((person) => (
              <div key={person.id}>
                <p className="font-medium">{person.name}</p>
                <RoleBadge role={person.role} className="mt-2" />
                <p className="mt-2 text-sm text-muted-foreground">{person.headline}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {MOCK_PROJECT_FEED.map((project) => (
          <Card key={project.id} className="rounded-[2rem] border-border/70">
            <CardContent className="space-y-3 p-6">
              <p className="text-lg font-semibold">{project.projectTitle}</p>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">{tag}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
