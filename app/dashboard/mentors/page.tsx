'use client'

import * as React from 'react'
import { apiClient } from '@/lib/api-client'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { GraduationCap, Search, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MentorConnectPage() {
  const [mentors, setMentors] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [skillFilter, setSkillFilter] = React.useState('')
  const [currentUser, setCurrentUser] = React.useState<any>(null)
  const [requestOpen, setRequestOpen] = React.useState(false)
  const [selectedMentor, setSelectedMentor] = React.useState<any>(null)
  const [requestMessage, setRequestMessage] = React.useState('')
  const [sending, setSending] = React.useState(false)

  React.useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) setCurrentUser(JSON.parse(storedUser))
    fetchMentors()
  }, [])

  const fetchMentors = async () => {
    try {
      const data = await apiClient.get<any[]>('/api/users?role=TEACHER')
      setMentors(data)
    } catch (error) {
      toast.error('Failed to load mentors')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestMentorship = async () => {
    if (!selectedMentor || !requestMessage.trim()) return
    setSending(true)
    try {
      await apiClient.post('/api/requests', {
        receiverId: selectedMentor.id,
        message: requestMessage,
        type: 'MENTORSHIP'
      })
      toast.success(`Mentorship request sent to ${selectedMentor.name}`)
      setRequestOpen(false)
      setRequestMessage('')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request')
    } finally {
      setSending(false)
    }
  }

  const filtered = mentors.filter((t) => {
    if (!skillFilter.trim()) return true
    const q = skillFilter.toLowerCase()
    return (
      t.name.toLowerCase().includes(q) ||
      t.skills.some((s: string) => s.toLowerCase().includes(q))
    )
  })

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    )
  }

  if (currentUser?.role !== 'STUDENT') {
    return (
      <Card className="rounded-2xl border-dashed">
        <CardHeader>
          <CardTitle>Mentor Connect</CardTitle>
          <CardDescription>
            This area is for students to discover teachers. Switch to a student account to request mentorship.
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
            Connect with experienced teachers and industry professionals to guide your drone journey.
          </p>
        </div>
      </div>

      <div className="max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          id="skill-filter"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          placeholder="Filter by skill or name..."
          className="rounded-full pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No mentors found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((t) => (
            <Card
              key={t.id}
              className="rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="size-12">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <RoleBadge role="teacher" className="mt-1" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {t.bio || 'Experienced drone professional ready to mentor students.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {t.skills.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Button
                  className="w-full rounded-full gap-2"
                  onClick={() => {
                    setSelectedMentor(t)
                    setRequestOpen(true)
                  }}
                >
                  <UserPlus className="size-4" /> Ask for Mentorship
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Mentorship</DialogTitle>
            <DialogDescription>
              Send a message to {selectedMentor?.name} explaining what you hope to learn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <textarea
                id="message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Hi! I'm interested in learning more about flight controllers and would love your guidance..."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
              />
            </div>
            <Button 
              className="w-full rounded-full" 
              onClick={handleRequestMentorship}
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
