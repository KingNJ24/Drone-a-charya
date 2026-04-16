'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'
import { toast } from 'sonner'
import { Star, MessageSquare, Share2, Heart } from 'lucide-react'
import { RoleBadge } from '@/components/dashboard/role-badge'

export default function FeedPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await apiClient.get<any>('/api/projects')
        setProjects(response.data)
      } catch (error) {
        toast.error('Failed to load feed')
      } finally {
        setLoading(false)
      }
    }
    fetchFeed()
  }, [])

  const handleLike = async (projectId: string) => {
    try {
      const response = await apiClient.post<any>(`/api/projects/${projectId}/like`, {})
      setProjects(projects.map(p => 
        p.id === projectId 
          ? { ...p, _count: { ...p._count, likes: response.count }, liked: response.liked }
          : p
      ))
      toast.success(response.liked ? 'Project liked' : 'Project unliked')
    } catch (error) {
      toast.error('Failed to like project')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading feed...</div>
  }

  if (projects.length === 0) {
    return (
      <div className="flex-1 space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Feed</h1>
          <p className="text-muted-foreground">Stay updated with your network&apos;s activity</p>
        </div>
        <div className="flex h-[450px] items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-primary/5">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Your feed is empty</EmptyTitle>
              <EmptyDescription>
                Start by following other drone enthusiasts or uploading your own projects!
              </EmptyDescription>
            </EmptyHeader>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/dashboard/projects/create">
                <Button className="rounded-full">Create Project</Button>
              </Link>
              <Link href="/dashboard/explore">
                <Button variant="outline" className="rounded-full">Explore</Button>
              </Link>
            </div>
          </Empty>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Feed</h1>
        <p className="text-muted-foreground">Stay updated with your network&apos;s activity</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden rounded-2xl border-border/80 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
              <Link href={`/dashboard/profile?id=${project.author.id}`}>
                <Avatar className="size-10 ring-2 ring-background">
                  <AvatarImage src={project.author.avatar} />
                  <AvatarFallback>{project.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/profile?id=${project.author.id}`} className="font-semibold hover:underline">
                    {project.author.name}
                  </Link>
                  <RoleBadge role={project.author.role.toLowerCase()} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              <div className="space-y-2">
                <Link href={`/dashboard/projects/${project.id}`}>
                  <h3 className="text-xl font-bold text-primary hover:underline">{project.title}</h3>
                </Link>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {project.description}
                </p>
              </div>

              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="rounded-full bg-secondary/50 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`rounded-full gap-2 ${project.liked ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => handleLike(project.id)}
                  >
                    <Heart className={`size-4 ${project.liked ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">{project._count?.likes || 0}</span>
                  </Button>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground">
                      <MessageSquare className="size-4" />
                      <span className="text-xs font-medium">{project._count?.comments || 0}</span>
                    </Button>
                  </Link>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
                  <Share2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
