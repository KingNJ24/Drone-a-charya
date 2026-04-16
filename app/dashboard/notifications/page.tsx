'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

export default function NotificationsPage() {
  const notifications: any[] = []

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on what matters to you</p>
      </div>

      {notifications.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No notifications</EmptyTitle>
            <EmptyDescription>You&apos;re all caught up!</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: any) => (
            <Card key={notification.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{notification.icon}</span>
                  <div>
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {notification.timestamp}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
