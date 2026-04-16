'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CreateProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    repository_url: '',
    visibility: 'public' as 'public' | 'private',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('You must be logged in')
        return
      }

      // This would be an API call to create the project
      // For now, we'll just redirect to projects page
      console.log('Creating project:', { ...formData, owner_id: user.id })
      router.push('/dashboard/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground">Share your drone project with the community</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Provide information about your drone project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Agricultural Drone Mapper"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={loading}
                  className="border-primary/20 focus-visible:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="description"
                  placeholder="Describe your project, its goals, and what makes it unique"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={loading}
                  className="border-primary/20 focus-visible:ring-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repository_url" className="text-sm font-medium">
                  Repository URL (Optional)
                </Label>
                <Input
                  id="repository_url"
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={formData.repository_url}
                  onChange={(e) =>
                    setFormData({ ...formData, repository_url: e.target.value })
                  }
                  disabled={loading}
                  className="border-primary/20 focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibility" className="text-sm font-medium">
                  Visibility
                </Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === 'public'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visibility: e.target.value as 'public' | 'private',
                        })
                      }
                      disabled={loading}
                    />
                    <span className="text-sm text-foreground">
                      Public - Anyone can view
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === 'private'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visibility: e.target.value as 'public' | 'private',
                        })
                      }
                      disabled={loading}
                    />
                    <span className="text-sm text-foreground">
                      Private - Invite only
                    </span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
