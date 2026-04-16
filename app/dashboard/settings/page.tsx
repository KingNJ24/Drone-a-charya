'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Preferences for your DroneHub workspace.
        </p>
      </div>
      <Card className="rounded-2xl border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>
            Control alerts for gigs, mentions, and mentor requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-alerts">Email summaries</Label>
              <p className="text-xs text-muted-foreground">Weekly digest of your network</p>
            </div>
            <Switch id="email-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push (future)</Label>
              <p className="text-xs text-muted-foreground">Mobile app notifications</p>
            </div>
            <Switch id="push" disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
