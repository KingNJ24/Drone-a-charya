'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Compass, Star, MessageSquare, ArrowRight } from 'lucide-react'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { toast } from 'sonner'

export default function ExplorePage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tags] = useState(['AI', 'Drone', 'Navigation', 'Simulation', 'ROS 2', 'Safety', 'Hardware', 'OpenSource'])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get<any>('/api/projects?limit=6')
        setProjects(response.data)
      } catch (error) {
        toast.error('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading exploration...</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Explore</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Discover standout builders, fresh projects, and active collaboration signals across the drone ecosystem.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Trending tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link key={tag} href={`/dashboard/explore?tag=${tag}`}>
                    <span className="rounded-full bg-secondary/50 border border-border/50 px-3 py-1 text-xs font-medium hover:bg-secondary transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 shadow-sm bg-primary/5">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Ready to build?</h3>
              <p className="text-sm text-muted-foreground">Share your own progress and get feedback from the community.</p>
              <Link href="/dashboard/projects/create" className="block">
                <Button className="w-full rounded-full gap-2">
                  Create Project <ArrowRight className="size-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold px-1">Featured Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id} className="rounded-2xl border-border/70 shadow-sm hover:shadow-md transition-all group">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarImage src={project.author.avatar} />
                      <AvatarFallback>{project.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{project.author.name}</p>
                      <RoleBadge role={project.author.role.toLowerCase()} className="text-[10px] h-4 px-1.5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <h3 className="font-bold text-primary group-hover:underline line-clamp-1">{project.title}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-muted-foreground">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-[10px]">
                        <Star className="size-3" /> {project._count?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1 text-[10px]">
                        <MessageSquare className="size-3" /> {project._count?.comments || 0}
                      </span>
                    </div>
                    <span className="text-[10px]">{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
