'use client'

import { MOCK_GIGS } from '@/lib/mock/dashboard-data'
import { RoleBadge } from '@/components/dashboard/role-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function GigsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Gigs for companies
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Fixed-scope engagements posted by verified teams. Apply with one click — responses
          land in Messages.
        </p>
      </div>

      <div className="grid gap-4">
        {MOCK_GIGS.map((g) => (
          <Card
            key={g.id}
            className="rounded-2xl border-border/80 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
              <div className="min-w-0 space-y-2">
                <CardTitle className="text-lg leading-snug">{g.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{g.company}</span>
                  <RoleBadge role={g.companyRole} />
                  <span className="text-xs text-muted-foreground">· {g.postedAt}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{g.budget}</p>
                <p className="text-xs text-muted-foreground">
                  {g.applicants} applicants
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <Button className="w-full shrink-0 rounded-full sm:w-auto">Apply</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
