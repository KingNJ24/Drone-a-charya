# Drone-a-charya Setup Guide

## Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase account (create one at https://supabase.com)
- A Vercel account (optional, for deployment)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd drone-a-charya
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Enter your project name and password
4. Choose your region
5. Wait for the project to be created

#### Get Your Credentials

1. Go to Project Settings > API
2. Copy your:
   - `NEXT_PUBLIC_SUPABASE_URL` (from "API URL")
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from "anon public" key)

#### Create Environment File

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### 4. Set Up Database

Run the migration script in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy the contents of `/scripts/01-create-schema.sql`
5. Execute the query

This will create all necessary tables and enable Row-Level Security (RLS).

### 5. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
drone-a-charya/
├── app/
│   ├── api/              # API routes for backend functionality
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Main dashboard and features
│   ├── globals.css       # Global styles and design tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard-specific components
│   └── ui/               # Reusable UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Utility functions
├── scripts/              # Database migration scripts
├── public/               # Static assets
├── API_DOCUMENTATION.md  # API reference
└── SETUP_GUIDE.md        # This file
```

## Key Features

### Authentication
- Email/password sign-up and login
- Role-based user types (Student/Teacher/Company)
- Session management with Supabase Auth

### Dashboard
- User profile management
- Project creation and browsing
- Social features (feed, connections, notifications)
- Search and exploration
- Organization management

### API
- RESTful endpoints for projects, connections, and notifications
- Real-time subscriptions using Supabase Realtime
- Row-Level Security for data protection

### Styling
- Tailwind CSS v4 with custom design tokens
- Shadcn/ui components
- Dark mode support
- Professional tech aesthetic (blue & cyan colors)

## Configuration

### Design Tokens

Edit `app/globals.css` to customize:
- Brand colors (primary, secondary, accent)
- Typography (fonts, sizes)
- Layout spacing
- Dark mode colors

Default palette:
- Primary: Deep tech blue (`oklch(0.35 0.2 260)`)
- Accent: Cyan (`oklch(0.48 0.18 200)`)

### Database Schema

Modify `scripts/01-create-schema.sql` to customize:
- Table structures
- Field types and constraints
- RLS policies
- Indexes and relationships

## Deployment

### Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your production URL + `/auth/callback`)
6. Click "Deploy"

### Update Supabase Auth Settings

After deployment, update your Supabase project's redirect URLs:

1. Go to Authentication > URL Configuration
2. Add your production URL:
   ```
   https://your-domain.com/auth/callback
   ```

## Common Tasks

### Add a New Dashboard Page

1. Create a new folder in `app/dashboard/[feature]/`
2. Create `page.tsx` in that folder
3. Add navigation item to `components/dashboard/sidebar.tsx`

Example:
```typescript
// app/dashboard/feature/page.tsx
export default function FeaturePage() {
  return (
    <div className="flex-1 space-y-8 p-8">
      <h1 className="text-4xl font-bold">Feature Name</h1>
      {/* Your content */}
    </div>
  )
}
```

### Create a New API Endpoint

1. Create file in `app/api/[resource]/route.ts`
2. Implement GET, POST, PATCH, DELETE as needed
3. Use Supabase client for database operations

Example:
```typescript
// app/api/feature/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Implement your logic
  return NextResponse.json({ data: [] })
}
```

### Add Real-time Features

Use the provided hooks in `hooks/use-realtime.ts`:

```typescript
import { useRealtimeNotifications } from '@/hooks/use-realtime'

export function MyComponent() {
  const userId = 'user-id'

  useRealtimeNotifications(userId, (payload) => {
    console.log('New notification:', payload.new)
  })

  return <div>Your component</div>
}
```

## Troubleshooting

### Authentication Issues

- **"Invalid login credentials"**: Check that email and password are correct
- **"Invalid redirect URL"**: Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` matches your Supabase settings
- **Session not persisting**: Check browser cookies and Supabase session settings

### Database Issues

- **"relation does not exist"**: Run the database migration script
- **"permission denied"**: Check RLS policies in Supabase
- **"FK constraint violation"**: Ensure referenced records exist

### Styling Issues

- **Colors not applying**: Clear `.next` folder and rebuild
- **Tailwind not working**: Ensure `globals.css` is imported in `layout.tsx`
- **Dark mode not working**: Check `html` tag has `.dark` class

## Support

For issues or questions:
1. Check the API documentation in `API_DOCUMENTATION.md`
2. Review Supabase docs at https://supabase.com/docs
3. Check Next.js docs at https://nextjs.org/docs

## License

This project is open source and available under the MIT License.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Vercel Documentation](https://vercel.com/docs)
