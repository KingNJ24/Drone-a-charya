/** Shared shapes for DroneHub REST API — swap mocks for fetch() responses. */

export type ApiRole = 'STUDENT' | 'TEACHER' | 'COMPANY'

export interface UserDTO {
  id: string
  name: string
  email: string
  role: ApiRole
  bio: string | null
  skills: string[]
  avatar: string | null
  createdAt: string
}

export interface ProjectDTO {
  id: string
  title: string
  description: string
  tags: string[]
  authorId: string
  repoLink: string | null
  fileUrl: string | null
  visibility: 'PUBLIC' | 'PRIVATE'
  starsCount: number
  createdAt: string
  author?: Pick<UserDTO, 'id' | 'name' | 'role' | 'avatar'>
  _count?: { likes: number; comments: number }
}

export interface FeedResponse {
  data: ProjectDTO[]
  pageInfo: { nextCursor: string | null; hasNextPage: boolean }
}
