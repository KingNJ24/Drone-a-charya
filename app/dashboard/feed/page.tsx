'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'

interface FeedItem {
  id: string
  user: {
    name: string
    avatar: string
    role: string
  }
  type: 'project_created' | 'project_updated' | 'connection_made' | 'comment'
  content: string
  metadata?: {
    projectName?: string
    projectId?: string
  }
  timestamp: string
  likes: number
  comments: number
  liked: boolean
}

export default function FeedPage() {
  const [feedItems] = useState<FeedItem[]>([
    {
      id: '1',
      user: {
        name: 'Alex Chen',
        avatar: 'A',
        role: 'Student'
      },
      type: 'project_created',
      content: 'Created a new project: Autonomous Crop Monitoring Drone',
      metadata: {
        projectName: 'Autonomous Crop Monitoring Drone',
        projectId: '1'
      },
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      liked: false
    },
    {
      id: '2',
      user: {
        name: 'Sarah Johnson',
        avatar: 'S',
        role: 'Teacher'
      },
      type: 'project_updated',
      content: 'Updated documentation for Quad Copter Design - added aerodynamics section',
      metadata: {
        projectName: 'Quad Copter Design',
        projectId: '2'
      },
      timestamp: '4 hours ago',
      likes: 8,
      comments: 2,
      liked: false
    },
    {
      id: '3',
      user: {
        name: 'TechCorp Industries',
        avatar: 'T',
        role: 'Company'
      },
      type: 'connection_made',
      content: 'is now following your projects. Connect back to see their work!',
      timestamp: '6 hours ago',
      likes: 0,
      comments: 0,
      liked: false
    },
    {
      id: '4',
      user: {
        name: 'Michael Wang',
        avatar: 'M',
        role: 'Student'
      },
      type: 'comment',
      content: 'Just checked out your drone design - really impressive use of composite materials!',
      timestamp: '8 hours ago',
      likes: 5,
      comments: 1,
      liked: false
    },
  ])

  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())

  const handleLike = (itemId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      project_created: '🚀',
      project_updated: '📝',
      connection_made: '👥',
      comment: '💬'
    }
    return icons[type] || '📢'
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Feed</h1>
        <p className="text-muted-foreground">Stay updated with your network&apos;s activity</p>
      </div>

      {feedItems.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Your feed is empty</EmptyTitle>
            <EmptyDescription>
              Follow users and join projects to see updates in your feed
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="max-w-2xl space-y-4">
          {feedItems.map((item) => (
            <Card key={item.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {item.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{item.user.name}</CardTitle>
                        <span className="text-xs text-muted-foreground">{item.user.role}</span>
                      </div>
                      <CardDescription className="text-xs">{item.timestamp}</CardDescription>
                    </div>
                  </div>
                  <span className="text-2xl">{getTypeIcon(item.type)}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-foreground">{item.content}</p>
                {item.metadata?.projectName && (
                  <Link href={`/dashboard/projects/${item.metadata.projectId}`}>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/50 transition-colors cursor-pointer">
                      <p className="text-sm font-semibold text-primary">{item.metadata.projectName}</p>
                    </div>
                  </Link>
                )}
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 hover:text-primary transition-colors ${
                      likedItems.has(item.id) ? 'text-primary' : ''
                    }`}
                  >
                    {likedItems.has(item.id) ? '❤️' : '🤍'} {(item.likes + (likedItems.has(item.id) ? 1 : 0))}
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    💬 {item.comments}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
