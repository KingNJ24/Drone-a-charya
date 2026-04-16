'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import Link from 'next/link'

interface Connection {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  skills: string[]
  connected: boolean
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'Alex Chen',
      role: 'Student',
      bio: 'Passionate about drone design and aerodynamics. Currently working on autonomous flight systems.',
      avatar: 'A',
      skills: ['CAD', 'Aerodynamics', 'Programming'],
      connected: true
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      role: 'Teacher',
      bio: 'Educator in Robotics and Aerospace. Mentoring the next generation of engineers.',
      avatar: 'S',
      skills: ['Mentoring', 'Aerospace', 'CAD'],
      connected: true
    },
    {
      id: '3',
      name: 'James Liu',
      role: 'Student',
      bio: 'Drone enthusiast working on environmental monitoring solutions.',
      avatar: 'J',
      skills: ['Data Analysis', 'Sensors', 'Python'],
      connected: true
    },
  ])

  const handleDisconnect = (id: string) => {
    setConnections(connections.filter(c => c.id !== id))
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Connections</h1>
          <p className="text-muted-foreground">
            You have {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/dashboard/explore">
          <Button className="bg-primary hover:bg-primary/90">Find More People</Button>
        </Link>
      </div>

      {connections.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No connections yet</EmptyTitle>
            <EmptyDescription>
              Start building your network by connecting with other drone enthusiasts
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link href="/dashboard/explore">
              <Button className="bg-primary hover:bg-primary/90">
                Find People to Connect
              </Button>
            </Link>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <Card key={connection.id} className="hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{connection.name}</CardTitle>
                    <CardDescription>{connection.role}</CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                    {connection.avatar}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{connection.bio}</p>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {connection.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={() => handleDisconnect(connection.id)}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
