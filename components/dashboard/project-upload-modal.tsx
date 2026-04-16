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

export function ProjectUploadModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-border/70 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload project</DialogTitle>
          <DialogDescription>
            Create a new project post for the feed, attach files, or link an existing
            repository.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="project-title">Title</Label>
            <Input id="project-title" placeholder="Adaptive corridor inspection stack" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              className="min-h-28 rounded-2xl"
              placeholder="Describe what you're building, what stage it's at, and where collaborators can help."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-tags">Tags</Label>
            <Input id="project-tags" placeholder="AI, Drone, Navigation, Simulation" />
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select defaultValue="public">
              <SelectTrigger className="rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-github">GitHub link</Label>
            <Input id="project-github" placeholder="https://github.com/your-org/project" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-file">Upload files</Label>
            <Input id="project-file" type="file" className="rounded-2xl" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="rounded-full" onClick={() => onOpenChange(false)}>
            Publish project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
