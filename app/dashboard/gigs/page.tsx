'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, Briefcase, DollarSign, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function GigsPage() {
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) setCurrentUser(JSON.parse(storedUser))
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    try {
      const data = await apiClient.get<any[]>('/api/gigs')
      setGigs(data)
    } catch (error) {
      toast.error('Failed to load gigs')
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async (gigId: string) => {
    try {
      await apiClient.post(`/api/gigs/${gigId}/apply`, {})
      toast.success('Application submitted successfully!')
      fetchGigs() // Refresh to update applicant count
    } catch (error: any) {
      toast.error(error.message || 'Failed to apply')
    }
  }

  const handleCreateGig = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCreating(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      budget: formData.get('budget') as string,
      requiredSkills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
    }

    try {
      await apiClient.post('/api/gigs', data)
      toast.success('Gig posted successfully!')
      setIsCreateOpen(false)
      fetchGigs()
    } catch (error: any) {
      toast.error(error.message || 'Failed to post gig')
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading gigs...</div>

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Drone Gigs & Opportunities
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
            Find projects posted by companies or post a new gig to find talent.
          </p>
        </div>
        {currentUser?.role === 'COMPANY' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2">
                <Plus className="size-4" /> Post Gig
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Post a New Gig</DialogTitle>
                <DialogDescription>
                  Describe the opportunity and required skills.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateGig} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Gig Title</Label>
                  <Input id="title" name="title" placeholder="e.g. Flight Controller Specialist" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget / Compensation</Label>
                  <Input id="budget" name="budget" placeholder="e.g. $500 - $1000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Required Skills (comma separated)</Label>
                  <Input id="skills" name="skills" placeholder="e.g. PX4, ArduPilot, C++" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? 'Posting...' : 'Post Gig'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {gigs.length === 0 ? (
          <Card className="rounded-2xl border-dashed">
            <CardContent className="p-12 text-center text-muted-foreground">
              <Briefcase className="size-12 mx-auto mb-4 opacity-20" />
              <p>No gigs available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          gigs.map((g) => (
            <Card
              key={g.id}
              className="rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md overflow-hidden"
            >
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0 bg-muted/30 pb-4">
                <div className="min-w-0 space-y-2">
                  <CardTitle className="text-lg leading-snug">{g.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-sm">{g.company.name}</span>
                    <RoleBadge role={g.company.role.toLowerCase()} />
                    <span className="text-xs text-muted-foreground">· {new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <DollarSign className="size-4" />
                    <span>{g.budget}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
                    <Users className="size-3" />
                    <span>{g._count?.applications || 0} applicants</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-wrap gap-2">
                    {g.requiredSkills.map((s: string) => (
                      <span
                        key={s}
                        className="rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {currentUser?.role === 'STUDENT' && (
                    <Button 
                      className="w-full shrink-0 rounded-full sm:w-auto"
                      onClick={() => handleApply(g.id)}
                    >
                      Apply Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
