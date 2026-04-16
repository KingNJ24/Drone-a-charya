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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type CollabType = 'mentorship' | 'collaboration'

export function CollaborationModal({
  open,
  onOpenChange,
  defaultType = 'collaboration',
  title = 'Start a collaboration',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: CollabType
  title?: string
}) {
  const [type, setType] = React.useState<CollabType>(defaultType)
  const [message, setMessage] = React.useState('')

  React.useEffect(() => {
    if (open) {
      setType(defaultType)
      setMessage('')
    }
  }, [open, defaultType])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Your message is routed to the project owner. You&apos;ll get a copy in
            Messages.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as CollabType)}
            >
              <SelectTrigger className="w-full rounded-xl">
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mentorship">Mentorship</SelectItem>
                <SelectItem value="collaboration">Collaboration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="collab-message">Message</Label>
            <Textarea
              id="collab-message"
              placeholder="Introduce yourself and what you're looking for..."
              className="min-h-[120px] rounded-xl resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
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
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
