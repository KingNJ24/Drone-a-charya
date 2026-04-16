'use client'

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiClient } from '@/lib/api-client'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, GitFork, Users, GitBranch, MessageSquare, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  
  const [project, setProject] = React.useState<any>(null)
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [requestOpen, setRequestOpen] = React.useState(false)
  const [requestType, setRequestType] = React.useState<'COLLABORATION' | 'MENTORSHIP'>('COLLABORATION')
  const [requestMessage, setRequestMessage] = React.useState('')
  const [sending, setSending] = React.useState(false)

  React.useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) setCurrentUser(JSON.parse(storedUser))
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const data = await apiClient.get<any>(`/api/projects/${projectId}`)
      setProject(data)
    } catch (error) {
      toast.error('Failed to load project details')
      router.push('/dashboard/feed')
    } finally {
      setLoading(false)
    }
  }

  const handleRequest = async () => {
    if (!requestMessage.trim()) return
    setSending(true)
    try {
      await apiClient.post('/api/requests', {
        receiverId: project.author.id,
        message: requestMessage,
        type: requestType
      })
      toast.success(`${requestType === 'MENTORSHIP' ? 'Mentorship' : 'Collaboration'} request sent!`)
      setRequestOpen(false)
      setRequestMessage('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request')
    } finally {
      setSending(false)
    }
  }

  const handleLike = async () => {
    try {
      const response = await apiClient.post<any>(`/api/projects/${projectId}/like`, {})
      setProject({ 
        ...project, 
        _count: { ...project._count, likes: response.count }, 
        liked: response.liked 
      })
      toast.success(response.liked ? 'Project liked' : 'Project unliked')
    } catch (error) {
      toast.error('Failed to like project')
    }
  }

  if (loading) return <ProjectLoading />
  if (!project) return null

  const isOwnProject = currentUser?.id === project.author.id
  const canRequestMentorship = currentUser?.role === 'STUDENT' && project.author.role === 'TEACHER'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/dashboard/feed" className="hover:text-foreground">
              Feed
            </Link>
            <span>/</span>
            <span className="font-mono text-foreground">{project.title}</span>
            <span className="rounded-md border border-border/80 px-1.5 py-0.5 text-xs">
              {project.visibility}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{project.title}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((t: string) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors ${project.liked ? 'text-primary font-semibold' : 'hover:text-foreground'}`}
            >
              <Star className={`size-4 ${project.liked ? 'fill-current' : ''}`} />
              {project._count?.likes || 0} stars
            </button>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="size-4" />
              {project._count?.comments || 0} comments
            </span>
            <span className="flex items-center gap-1.5">
              <GitBranch className="size-4" />
              updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {!isOwnProject && (
          <div className="flex w-full shrink-0 flex-col gap-2 sm:flex-row lg:w-56 lg:flex-col">
            <Button 
              className="rounded-full" 
              onClick={() => {
                setRequestType('COLLABORATION')
                setRequestOpen(true)
              }}
            >
              Collaborate
            </Button>
            {canRequestMentorship && (
              <Button
                variant="secondary"
                className="rounded-full"
                onClick={() => {
                  setRequestType('MENTORSHIP')
                  setRequestOpen(true)
                }}
              >
                Ask for Mentorship
              </Button>
            )}
            <Button variant="outline" className="rounded-full" asChild>
              <Link href={`/dashboard/messages?userId=${project.author.id}`}>Message Owner</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Tabs defaultValue="overview" className="min-w-0">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl bg-muted/40 p-1">
            <TabsTrigger value="overview" className="rounded-xl">
              Overview
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-xl">
              Comments
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {project.description}
                </p>
                {project.repoLink && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Repository</p>
                    <a href={project.repoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      <GitFork className="size-3" /> {project.repoLink}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comments" className="mt-4">
            <Card className="rounded-2xl border-border/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Discussion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Avatar className="size-8">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>{currentUser?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input placeholder="Add a comment..." className="rounded-full" />
                    <Button size="icon" className="rounded-full shrink-0"><Send className="size-4" /></Button>
                  </div>
                </div>
                <Separator />
                <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl">
                  Comments feature integration coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">
          <Card className="rounded-2xl border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">About Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={project.author.avatar} />
                  <AvatarFallback>{project.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/dashboard/profile?id=${project.author.id}`} className="font-semibold hover:underline">
                    {project.author.name}
                  </Link>
                  <RoleBadge role={project.author.role.toLowerCase()} className="mt-1" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {project.author.bio || 'Drone enthusiast and builder.'}
              </p>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Stars</p>
                  <p className="font-bold">{project._count?.likes || 0}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Comments</p>
                  <p className="font-bold">{project._count?.comments || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {requestType === 'MENTORSHIP' ? 'Request Mentorship' : 'Collaboration Request'}
            </DialogTitle>
            <DialogDescription>
              {requestType === 'MENTORSHIP' 
                ? `Send a message to ${project.author.name} to request guidance on this project.`
                : `Tell ${project.author.name} how you'd like to help with this project.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="req-message">Your Message</Label>
              <textarea
                id="req-message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="I'm really interested in this project because..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </div>
            <Button 
              className="w-full rounded-full" 
              onClick={handleRequest}
              disabled={sending || !requestMessage.trim()}
            >
              {sending ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProjectLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="space-y-4 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton className="size-32 rounded-2xl ml-8" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-2xl" />
    </div>
  )
}
