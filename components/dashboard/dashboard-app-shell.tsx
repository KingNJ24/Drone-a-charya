'use client'

import { useState, type ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { createClient } from '@/lib/supabase/client'
import {
  Bell,
  Briefcase,
  Compass,
  FolderKanban,
  GraduationCap,
  Home,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Search,
  Sun,
  User,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  MOCK_ACTIVE_COLLABORATORS,
  MOCK_ME,
  MOCK_MENTORS,
  MOCK_TRENDING,
} from '@/lib/mock/dashboard-data'
import { CreateProjectModal } from '@/components/dashboard/create-project-modal'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { useViewerRole } from '@/hooks/use-viewer-role'
import type { AppRole } from '@/lib/role'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

function navForRole(role: AppRole) {
  const items: {
    href: string
    label: string
    icon: LucideIcon
  }[] = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
  ]
  if (role === 'student') {
    items.push({
      href: '/dashboard/mentors',
      label: 'Mentor Connect',
      icon: GraduationCap,
    })
  }
  items.push({ href: '/dashboard/explore', label: 'Explore', icon: Compass })
  if (role === 'student' || role === 'company') {
    items.push({ href: '/dashboard/gigs', label: 'Gigs', icon: Briefcase })
  }
  items.push({ href: '/dashboard/profile', label: 'Profile', icon: User })
  return items
}

function NavLinks({
  pathname,
  onNavigate,
  role,
}: {
  pathname: string
  onNavigate?: () => void
  role: AppRole
}) {
  const nav = navForRole(role)
  return (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/dashboard/'
            : pathname.startsWith(href)
        return (
          <Link key={href} href={href} onClick={onNavigate}>
            <span
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0 opacity-90" />
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function RightRail() {
  return (
    <aside className="hidden w-[320px] shrink-0 xl:block">
      <div className="sticky top-16 space-y-4 pb-8 pt-4">
        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md">
          <p className="text-sm font-semibold tracking-tight">Suggested Mentors</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Teachers active in autonomy & safety
          </p>
          <ul className="mt-4 space-y-4">
            {MOCK_MENTORS.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 gap-2">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs font-semibold">
                      {m.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-tight">
                      {m.name}
                    </p>
                    <RoleBadge role="teacher" className="mt-1" />
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {m.specialty}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 rounded-full text-xs" asChild>
                  <Link href="/dashboard/mentors">View</Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold">Trending Projects</p>
          <ul className="mt-3 space-y-3">
            {MOCK_TRENDING.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/dashboard/projects/${encodeURIComponent(p.id)}`}
                  className="group block rounded-xl p-2 transition-colors hover:bg-muted/60"
                >
                  <p className="text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                    {p.owner}/{p.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {p.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    ★ {p.stars.toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm">
          <p className="text-sm font-semibold">Active Collaborators</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Shipping across the network this week
          </p>
          <ul className="mt-3 space-y-3">
            {MOCK_ACTIVE_COLLABORATORS.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-xl p-2 hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.activeOn}</p>
                  <RoleBadge role={c.role} className="mt-1.5" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export function DashboardAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const { role: viewerRole } = useViewerRole()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-3 px-4 md:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="border-b px-4 py-4 text-left">
                <SheetTitle className="flex items-center gap-2 font-semibold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    DH
                  </span>
                  DroneHub
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-96px)]">
                <NavLinks
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                  role={viewerRole}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              DH
            </span>
            <span className="hidden sm:inline">DroneHub</span>
          </Link>

          <div className="relative mx-auto hidden max-w-xl flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, projects, skills..."
              className="h-10 rounded-full border-border/80 bg-muted/40 pl-10 pr-4 shadow-inner"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              asChild
            >
              <Link href="/dashboard/search" aria-label="Search">
                <Search className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard/notifications" aria-label="Notifications">
                <Bell className="size-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard/messages" aria-label="Messages">
                <MessageSquare className="size-5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 rounded-full pl-2 pr-1"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={MOCK_ME.avatarUrl} alt="" />
                    <AvatarFallback>{MOCK_ME.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel className="space-y-1">
                  <p className="text-sm font-medium">{MOCK_ME.name}</p>
                  <RoleBadge role={MOCK_ME.role} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link href="/dashboard/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link href="/dashboard/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="border-t border-border/60 px-4 py-2 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users, projects, skills..."
              className="h-9 rounded-full border-border/80 bg-muted/40 pl-9"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-border/80 bg-muted/20 md:block lg:w-60">
          <ScrollArea className="h-full">
            <div className="p-3">
              <NavLinks pathname={pathname} role={viewerRole} />
              <Separator className="my-4" />
              <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                DroneHub
              </p>
              <p className="px-3 pb-2 text-xs leading-relaxed text-muted-foreground">
                LinkedIn-style network + GitHub-style projects for drone teams.
              </p>
            </div>
          </ScrollArea>
        </aside>

        <main className="min-w-0 flex-1 border-x border-border/40 bg-background/50">
          <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>

        <RightRail />
      </div>

      <Button
        type="button"
        size="icon"
        className="fixed bottom-8 right-6 z-40 size-14 rounded-full shadow-lg transition-transform hover:scale-105 xl:right-8"
        aria-label="New project"
        onClick={() => setCreateOpen(true)}
      >
        <Plus className="size-7" />
      </Button>
      <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
