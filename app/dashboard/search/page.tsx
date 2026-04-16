'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'person' | 'project' | 'organization'
  metadata: Record<string, any>
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)

  // Mock search results
  const allResults: SearchResult[] = [
    {
      id: '1',
      title: 'Alex Chen',
      description: 'Student interested in drone design and aerodynamics',
      type: 'person',
      metadata: { role: 'Student', skills: ['CAD', 'Programming'] }
    },
    {
      id: '2',
      title: 'Agricultural Drone Mapper',
      description: 'AI-powered system for monitoring crop health with real-time data analysis',
      type: 'project',
      metadata: { owner: 'Emma Rodriguez', collaborators: 5 }
    },
    {
      id: '3',
      title: 'Tech Innovation Lab',
      description: 'Collaborative space for drone technology innovation',
      type: 'organization',
      metadata: { type: 'Institution', members: 24 }
    },
    {
      id: '4',
      title: 'Autonomous Flight Systems',
      description: 'Research project on autonomous navigation and flight control',
      type: 'project',
      metadata: { owner: 'Prof. David Kumar', collaborators: 12 }
    },
    {
      id: '5',
      title: 'DroneWorks Inc.',
      description: 'Commercial drone solutions for agriculture and surveying',
      type: 'organization',
      metadata: { type: 'Company', members: 45 }
    },
    {
      id: '6',
      title: 'Maria Garcia',
      description: 'Environmental monitoring with drone technology',
      type: 'person',
      metadata: { role: 'Student', skills: ['Sensors', 'Data Analysis'] }
    },
  ]

  const filteredResults = useMemo(() => {
    if (!query.trim()) return allResults

    return allResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const results = {
    people: filteredResults.filter(r => r.type === 'person'),
    projects: filteredResults.filter(r => r.type === 'project'),
    organizations: filteredResults.filter(r => r.type === 'organization'),
  }

  const totalResults = filteredResults.length

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Search</h1>
        <div className="max-w-2xl">
          <Input
            placeholder="Search people, projects, and organizations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-primary/20 focus-visible:ring-primary/50 h-12"
            autoFocus
          />
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              {query.trim()
                ? `No results found for "${query}". Try searching for something else.`
                : 'Enter a search query to get started'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''}
          </p>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="people">People ({results.people.length})</TabsTrigger>
              <TabsTrigger value="projects">Projects ({results.projects.length})</TabsTrigger>
              <TabsTrigger value="organizations">Orgs ({results.organizations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-6">
              {filteredResults.map((result) => (
                <SearchResultCard key={result.id} result={result} />
              ))}
            </TabsContent>

            <TabsContent value="people" className="space-y-3 mt-6">
              {results.people.length === 0 ? (
                <Card className="py-8">
                  <CardContent className="text-center text-muted-foreground">
                    No people found
                  </CardContent>
                </Card>
              ) : (
                results.people.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-3 mt-6">
              {results.projects.length === 0 ? (
                <Card className="py-8">
                  <CardContent className="text-center text-muted-foreground">
                    No projects found
                  </CardContent>
                </Card>
              ) : (
                results.projects.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              )}
            </TabsContent>

            <TabsContent value="organizations" className="space-y-3 mt-6">
              {results.organizations.length === 0 ? (
                <Card className="py-8">
                  <CardContent className="text-center text-muted-foreground">
                    No organizations found
                  </CardContent>
                </Card>
              ) : (
                results.organizations.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 space-y-8 p-8">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <div className="h-12 max-w-2xl animate-pulse rounded-lg bg-muted" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      person: '👤',
      project: '🚀',
      organization: '🏢'
    }
    return icons[type] || '📄'
  }

  const getAction = (type: string) => {
    const actions: Record<string, string> = {
      person: 'Connect',
      project: 'View Project',
      organization: 'Join'
    }
    return actions[type] || 'View'
  }

  return (
    <Card className="hover:border-primary/50 hover:shadow-lg transition-all">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-3xl">{getIcon(result.type)}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{result.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {result.type === 'person' && result.metadata.skills && (
                <>
                  {result.metadata.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </>
              )}
              {result.type === 'project' && result.metadata.owner && (
                <span className="text-xs text-muted-foreground">
                  by {result.metadata.owner}
                </span>
              )}
              {result.type === 'organization' && result.metadata.members && (
                <span className="text-xs text-muted-foreground">
                  {result.metadata.members} members
                </span>
              )}
            </div>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
          {getAction(result.type)}
        </Button>
      </CardContent>
    </Card>
  )
}
