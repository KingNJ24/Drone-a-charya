'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function CreateProjectModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [repoLink, setRepoLink] = React.useState('')
  const [fileNote, setFileNote] = React.useState('')
  const [visibility, setVisibility] = React.useState<'public' | 'private'>('public')

  const reset = () => {
    setTitle('')
    setDescription('')
    setTags('')
    setRepoLink('')
    setFileNote('')
    setVisibility('public')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description are required')
      return
    }
    toast.success('Project draft saved (mock). Wire to POST /api/projects when backend is live.')
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-h-[90vh] gap-4 overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
          <DialogDescription>
            Projects appear in the global feed. Map this form to{' '}
            <code className="rounded bg-muted px-1 text-xs">POST /api/projects</code>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cp-title">Title</Label>
            <Input
              id="cp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Monsoon SITL Lab"
              className="rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-desc">Description</Label>
            <Textarea
              id="cp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building? Who is it for?"
              className="min-h-[100px] rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-tags">Tags (comma-separated)</Label>
            <Input
              id="cp-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, Drone, Navigation, Simulation"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-repo">GitHub / repo link</Label>
            <Input
              id="cp-repo"
              type="url"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/org/repo"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cp-files">Files (preview)</Label>
            <Input
              id="cp-files"
              value={fileNote}
              onChange={(e) => setFileNote(e.target.value)}
              placeholder="Upload wired to S3 / Cloudinary in production"
              className="rounded-xl"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Enable file upload via presigned URLs in API layer.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as 'public' | 'private')}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl">
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
