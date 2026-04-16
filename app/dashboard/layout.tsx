import { DashboardAppShell } from '@/components/dashboard/dashboard-app-shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardAppShell>{children}</DashboardAppShell>
}
