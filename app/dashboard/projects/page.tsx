'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export default function ProjectsPage() {
  const projects: any[] = [] // Will be populated from database

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage and explore drone projects</p>
        </div>
        <Link href="/dashboard/projects/create">
          <Button className="bg-primary hover:bg-primary/90">Create Project</Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              Create your first project or explore projects from the community
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-wrap gap-2">
              <Link href="/dashboard/projects/create">
                <Button className="bg-primary hover:bg-primary/90">
                  Create Project
                </Button>
              </Link>
              <Link href="/dashboard/explore">
                <Button variant="outline">Browse Projects</Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {project.collaborators?.length || 0} collaborators
                    </span>
                    <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                      {project.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
