# DroneHub Backend Blueprint

## Folder structure

```text
app/
  api/
    auth/
      signup/route.ts
      login/route.ts
    users/
      [id]/route.ts
      update/route.ts
    projects/
      route.ts
      [id]/route.ts
      [id]/like/route.ts
      [id]/comment/route.ts
    requests/
      route.ts
      [id]/route.ts
    connect/
      route.ts
      [id]/route.ts
    gigs/
      route.ts
      [id]/apply/route.ts
prisma/
  schema.prisma
  seed.ts
server/
  config/env.ts
  controllers/
  middleware/
  services/
  validations/
  lib/
```

## Notes

- `app/api/*` contains thin Next.js route handlers only.
- `server/controllers/*` maps HTTP input to service calls.
- `server/services/*` owns business logic and Prisma access.
- `server/middleware/*` handles auth, role checks, and validation helpers.
- `server/lib/*` centralizes Prisma, JWT, Redis, API responses, and error handling.
- `prisma/schema.prisma` models users, projects, likes, comments, mentorship requests, connections, gigs, and applications.
- `prisma/seed.ts` creates realistic sample users, a project, social interactions, requests, connections, and a company gig.

## Real-time and uploads

- `server/services/notification.service.ts` is the placeholder seam for Socket.io or Redis pub/sub notifications.
- `server/services/upload.service.ts` provides S3 signed upload URL generation for avatars and project files.
