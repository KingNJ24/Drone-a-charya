import { cn } from '@/lib/utils'
import type { Role } from '@/lib/mock/dashboard-data'
import { normalizeAppRole } from '@/lib/role'

const styles: Record<
  Role,
  string
> = {
  student:
    'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 dark:bg-blue-500/15',
  teacher:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 dark:bg-emerald-500/15',
  company:
    'border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-300 dark:bg-violet-500/15',
}

const label: Record<Role, string> = {
  student: 'Student',
  teacher: 'Teacher',
  company: 'Company',
}

export function RoleBadge({
  role,
  className,
}: {
  role: Role | string
  className?: string
}) {
  const r = normalizeAppRole(role)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        styles[r],
        className,
      )}
    >
      {label[r]}
    </span>
  )
}
