'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-8">
      <Card className="rounded-2xl border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted">
            <MessageSquare className="size-6 text-muted-foreground" />
          </div>
          <CardTitle className="mt-4">Messages</CardTitle>
          <CardDescription>
            Direct messages and collaboration threads will appear here. Connect the chat
            backend when you&apos;re ready.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button variant="outline" className="rounded-full" disabled>
            Compose (soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
