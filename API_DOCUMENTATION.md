# Drone-a-charya API Documentation

## Overview

Drone-a-charya is a collaborative platform for drone technology enthusiasts, students, teachers, and companies. This document provides an overview of the API endpoints and real-time features.

## Authentication

All API endpoints require authentication via Supabase Auth. Users must be logged in and have a valid session.

## Base URL

```
/api
```

## API Endpoints

### Projects

#### Get User Projects
```
GET /api/projects
```

Returns all projects owned by the authenticated user.

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Project description",
      "owner_id": "uuid",
      "visibility": "public|private",
      "repository_url": "https://...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Project
```
POST /api/projects
```

Creates a new project.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "repository_url": "https://github.com/...",
  "visibility": "public"
}
```

**Response:** `201 Created`

### Connections

#### Get User Connections
```
GET /api/connections
```

Returns all accepted connections for the authenticated user.

**Response:**
```json
{
  "connections": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "connected_user_id": "uuid",
      "status": "accepted",
      "created_at": "2024-01-01T00:00:00Z",
      "connected_user": {
        "id": "uuid",
        "name": "User Name",
        "email": "user@example.com",
        "role": "student|teacher|company",
        "bio": "User bio"
      }
    }
  ]
}
```

#### Create Connection Request
```
POST /api/connections
```

Sends a connection request to another user.

**Request Body:**
```json
{
  "connected_user_id": "uuid"
}
```

**Response:** `201 Created`

#### Remove Connection
```
DELETE /api/connections?id=<connection_id>
```

Removes a connection.

**Response:** `200 OK`

### Notifications

#### Get Unread Notifications
```
GET /api/notifications
```

Returns unread notifications for the authenticated user.

**Response:**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "connection_request|project_update|comment",
      "content": "Notification message",
      "read": false,
      "metadata": {},
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Mark Notification as Read
```
PATCH /api/notifications
```

Marks a notification as read.

**Request Body:**
```json
{
  "notificationId": "uuid",
  "read": true
}
```

**Response:** `200 OK`

## Real-time Features

The application uses Supabase Realtime for live updates. Custom hooks are provided for subscribing to changes:

### Available Hooks

#### useRealtimeNotifications
Subscribe to new notifications for the authenticated user.

```typescript
import { useRealtimeNotifications } from '@/hooks/use-realtime'

export function MyComponent() {
  useRealtimeNotifications(userId, (payload) => {
    console.log('New notification:', payload.new)
  })
}
```

#### useRealtimeProjectUpdates
Subscribe to project updates.

```typescript
import { useRealtimeProjectUpdates } from '@/hooks/use-realtime'

export function ProjectComponent() {
  useRealtimeProjectUpdates(projectId, (payload) => {
    console.log('Project updated:', payload.new)
  })
}
```

#### useRealtimeFeedUpdates
Subscribe to new feed items.

```typescript
import { useRealtimeFeedUpdates } from '@/hooks/use-realtime'

export function FeedComponent() {
  useRealtimeFeedUpdates(userId, (payload) => {
    console.log('New feed item:', payload.new)
  })
}
```

## Database Schema

### Tables

#### users
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `name` (VARCHAR)
- `role` (VARCHAR: student, teacher, company)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `skills` (TEXT)
- `location` (VARCHAR)
- `verified_status` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### projects
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `owner_id` (UUID, Foreign Key -> users)
- `visibility` (VARCHAR: public, private)
- `repository_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### connections
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users)
- `connected_user_id` (UUID, Foreign Key -> users)
- `status` (VARCHAR: pending, accepted, rejected)
- `created_at` (TIMESTAMP)

#### notifications
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users)
- `type` (VARCHAR)
- `content` (TEXT)
- `read` (BOOLEAN)
- `metadata` (JSONB)
- `created_at` (TIMESTAMP)

#### feed_items
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> users)
- `type` (VARCHAR)
- `content` (TEXT)
- `metadata` (JSONB)
- `likes` (INTEGER)
- `created_at` (TIMESTAMP)

#### organizations
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `slug` (VARCHAR, Unique)
- `logo_url` (TEXT)
- `description` (TEXT)
- `type` (VARCHAR: company, school, institution)
- `owner_id` (UUID, Foreign Key -> users)
- `created_at` (TIMESTAMP)

#### org_members
- `id` (UUID, Primary Key)
- `org_id` (UUID, Foreign Key -> organizations)
- `user_id` (UUID, Foreign Key -> users)
- `role` (VARCHAR: admin, member, viewer)
- `joined_at` (TIMESTAMP)

## Error Handling

All errors return a JSON response with an error message:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `500` - Internal Server Error

## Security

- All endpoints require authentication
- Row-Level Security (RLS) policies are enforced at the database level
- Sensitive data is protected through Supabase Auth
- API requests must include valid session tokens

## Usage Examples

### Create a Project
```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'My Drone Project',
    description: 'A description of my project',
    visibility: 'public'
  })
})

const { project } = await response.json()
```

### Connect with a User
```typescript
const response = await fetch('/api/connections', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    connected_user_id: 'target-user-uuid'
  })
})

const { connection } = await response.json()
```

### Subscribe to Notifications
```typescript
import { useRealtimeNotifications } from '@/hooks/use-realtime'
import { useEffect, useState } from 'react'

export function NotificationComponent() {
  const [notifications, setNotifications] = useState([])

  useRealtimeNotifications(userId, (payload) => {
    setNotifications(prev => [payload.new, ...prev])
  })

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>{notif.content}</div>
      ))}
    </div>
  )
}
```

## Future Enhancements

- File uploads for project attachments
- Advanced search with filtering
- Project collaboration features
- Direct messaging between users
- Project comments and discussions
- Activity tracking and analytics
- Integration with GitHub repositories
