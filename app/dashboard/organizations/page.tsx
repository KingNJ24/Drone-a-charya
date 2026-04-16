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

interface Organization {
  id: string
  name: string
  type: 'company' | 'school' | 'institution'
  logo: string
  description: string
  members: number
  owner: string
}

export default function OrganizationsPage() {
  const [organizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Tech Innovation Lab',
      type: 'institution',
      logo: 'TIL',
      description: 'A collaborative space for drone technology innovation and research',
      members: 24,
      owner: 'Prof. David Kumar'
    },
    {
      id: '2',
      name: 'DroneWorks Inc.',
      type: 'company',
      logo: 'DW',
      description: 'Commercial drone solutions for agriculture and surveying',
      members: 45,
      owner: 'John Martinez'
    },
  ])

  const publicOrganizations: Organization[] = [
    {
      id: '3',
      name: 'Aerial Robotics Club',
      type: 'institution',
      logo: 'ARC',
      description: 'University club focused on aerial robotics education and projects',
      members: 18,
      owner: 'Sarah Chen'
    },
    {
      id: '4',
      name: 'SkyTech Academy',
      type: 'school',
      logo: 'STA',
      description: 'Online academy for learning drone design and engineering',
      members: 156,
      owner: 'Dr. Michael Brown'
    },
  ]

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      company: 'Company',
      school: 'School',
      institution: 'Institution'
    }
    return labels[type] || type
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground">Manage and discover organizations</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">Create Organization</Button>
      </div>

      {/* My Organizations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">My Organizations</h2>
        {organizations.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No organizations yet</EmptyTitle>
              <EmptyDescription>
                Create or join an organization to collaborate with others
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {organizations.map((org) => (
              <Link key={org.id} href={`/dashboard/organizations/${org.id}`}>
                <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{org.name}</CardTitle>
                        <CardDescription>{getTypeLabel(org.type)}</CardDescription>
                      </div>
                      <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                        {org.logo}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{org.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>👥 {org.members} members</span>
                      <span>Owner: {org.owner}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Public Organizations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Discover Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publicOrganizations.map((org) => (
            <Card key={org.id} className="hover:border-primary/50 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>{getTypeLabel(org.type)}</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                    {org.logo}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{org.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>👥 {org.members} members</span>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Join Organization
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
