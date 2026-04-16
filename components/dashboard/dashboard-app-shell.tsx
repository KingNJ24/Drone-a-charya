'use client'

import { useState, useEffect, type ReactNode } from 'react'
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
import { apiClient } from '@/lib/api-client'
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
  LogOut,
  Settings,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { CreateProjectModal } from '@/components/dashboard/create-project-modal'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

function navForRole(role: string) {
  const items: {
    href: string
    label: string
    icon: LucideIcon
  }[] = [
    { href: '/dashboard/feed', label: 'Feed', icon: Home },
    { href: '/dashboard/projects', label: 'My Projects', icon: FolderKanban },
  ]
  if (role === 'STUDENT') {
    items.push({
      href: '/dashboard/mentors',
      label: 'Find Mentors',
      icon: GraduationCap,
    })
  }
  items.push({ href: '/dashboard/explore', label: 'Explore', icon: Compass })
  items.push({ href: '/dashboard/messages', label: 'Messages', icon: MessageSquare })
  
  if (role === 'STUDENT' || role === 'COMPANY') {
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
  role: string
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
          <p className="text-sm font-semibold tracking-tight">Suggested Connections</p>
          <p className="mt-1 text-xs text-muted-foreground">
            People you might know in drone tech
          </p>
          <div className="mt-4 p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            Suggestions coming soon
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold">Trending Projects</p>
          <div className="mt-4 p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
            Trending projects coming soon
          </div>
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
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('dronehub_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth/login')
    }
  }, [router])

  const handleLogout = () => {
    apiClient.logout()
    localStorage.removeItem('dronehub_user')
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }

  if (!user) return null

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
                  role={user.role}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <Link
            href="/dashboard/feed"
            className="hidden items-center gap-2 md:flex"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              DH
            </div>
            <span className="text-lg font-bold tracking-tight">DroneHub</span>
          </Link>

          <div className="relative flex-1 md:ml-6 md:max-w-md">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects, people, or gigs..."
              className="h-9 w-full rounded-full border-border/80 bg-muted/50 pl-9 transition-all focus-visible:bg-background focus-visible:ring-primary/50 md:w-80 lg:w-96"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full md:flex"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden rounded-full md:flex"
            >
              <Bell className="size-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-8 rounded-full p-0 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : '??'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="size-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="size-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  variant="destructive"
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="hidden h-9 items-center gap-2 rounded-full px-4 md:flex"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="size-4" /> Create
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1600px] flex-1">
        <aside className="hidden w-64 shrink-0 border-r border-border/80 md:block">
          <div className="sticky top-14 flex flex-col justify-between py-4">
            <NavLinks pathname={pathname} role={user.role} />
          </div>
        </aside>

        <main className="flex-1 px-4 py-8 md:px-8">
          {children}
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
