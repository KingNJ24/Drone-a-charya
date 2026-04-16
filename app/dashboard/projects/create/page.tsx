'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function CreateProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repoLink: '',
    tags: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      await apiClient.post('/api/projects', payload)
      toast.success('Project created successfully!')
      router.push('/dashboard/feed')
    } catch (err: any) {
      const msg = err.message || 'Failed to create project'
      setError(msg)
      toast.error(msg)
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
                <Label htmlFor="title" className="text-sm font-medium">
                  Project Title
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Agricultural Drone Mapper"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
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
                <Label htmlFor="repoLink" className="text-sm font-medium">
                  Repository URL (Optional)
                </Label>
                <Input
                  id="repoLink"
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={formData.repoLink}
                  onChange={(e) =>
                    setFormData({ ...formData, repoLink: e.target.value })
                  }
                  disabled={loading}
                  className="border-primary/20 focus-visible:ring-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g., drone, ai, agriculture"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
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
                      value="PUBLIC"
                      checked={formData.visibility === 'PUBLIC'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visibility: e.target.value as 'PUBLIC' | 'PRIVATE',
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
                      value="PRIVATE"
                      checked={formData.visibility === 'PRIVATE'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          visibility: e.target.value as 'PUBLIC' | 'PRIVATE',
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
