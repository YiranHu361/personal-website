import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAdminConfigured, isAdminToken } from '@/lib/adminAuth'
import { RESUME_PATH, getResumeStats, isStatsConfigured } from '@/lib/resumeStats'
import type { ResumeStats } from '@/lib/resumeStats'

export const metadata: Metadata = {
  title: 'Resume Stats',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

const LOGIN_ERRORS: Record<string, string> = {
  invalid: 'Wrong password.',
  limit: 'Too many attempts. Try again in 15 minutes.',
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const dayFormatter = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' })

function formatDay(date: string): string {
  return dayFormatter.format(new Date(`${date}T12:00:00Z`))
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen bg-[#f8f9fa] text-[#212529]">
      <div className="absolute inset-0 tech-grid" aria-hidden="true" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 text-[10px] uppercase tracking-[0.5em]">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#7209b7]" />
            <span>Private // Resume Stats</span>
          </div>
          <a href="/" className="hover:text-[#7209b7]">Back to site</a>
        </div>
        {children}
      </div>
    </main>
  )
}

function LoginCard({ error }: { error?: string }) {
  if (!isAdminConfigured()) {
    return (
      <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
        <p className="text-sm">Sign-in is not set up yet. Add an ADMIN_PASSWORD environment variable to enable this page.</p>
      </div>
    )
  }

  return (
    <form action="/api/admin/login" method="post" className="max-w-md border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
      <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.3em]">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="mt-3 w-full border border-[#111] bg-transparent px-3 py-2 text-sm focus:border-[#7209b7] focus:outline-none"
      />
      {error && LOGIN_ERRORS[error] && (
        <p className="mt-3 text-[11px] text-[#b00020]" role="alert">{LOGIN_ERRORS[error]}</p>
      )}
      <button
        type="submit"
        className="mt-5 border border-[#111] bg-[#111] px-5 py-2 text-[11px] uppercase tracking-[0.3em] text-[#f8f9fa] hover:bg-[#7209b7] hover:border-[#7209b7]"
      >
        Sign in
      </button>
    </form>
  )
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[#111] bg-[#f8f9fa] p-4 hard-shadow-sm">
      <p className="text-[10px] uppercase tracking-[0.3em]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value.toLocaleString('en-US')}</p>
    </div>
  )
}

function DailyChart({ daily }: { daily: ResumeStats['daily'] }) {
  const max = Math.max(1, ...daily.map((day) => day.count))

  return (
    <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
      <p className="text-[10px] uppercase tracking-[0.3em]">Downloads per day, last 14 days</p>
      <div className="mt-10 flex h-40 items-end border-b border-[#212529]/30">
        {daily.map((day, index) => {
          const align =
            index < 3 ? 'left-0' : index > daily.length - 4 ? 'right-0' : 'left-1/2 -translate-x-1/2'
          return (
            <div
              key={day.date}
              tabIndex={0}
              aria-label={`${formatDay(day.date)}: ${day.count} downloads`}
              className="group relative flex h-full flex-1 items-end justify-center px-px focus:outline-none"
            >
              {day.count > 0 && (
                <div
                  className="w-full max-w-[24px] rounded-t-[4px] bg-[#7209b7] group-hover:bg-[#560a8a] group-focus:bg-[#560a8a]"
                  style={{ height: `${(day.count / max) * 100}%` }}
                />
              )}
              <div
                className={`pointer-events-none absolute -top-9 ${align} z-10 whitespace-nowrap border border-[#111] bg-[#f8f9fa] px-2 py-1 text-[10px] opacity-0 group-hover:opacity-100 group-focus:opacity-100`}
              >
                {formatDay(day.date)} // {day.count}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[#212529]/70">
        <span>{formatDay(daily[0].date)}</span>
        <span>{formatDay(daily[daily.length - 1].date)}</span>
      </div>
    </div>
  )
}

function RecentTable({ recent }: { recent: ResumeStats['recent'] }) {
  return (
    <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
      <p className="text-[10px] uppercase tracking-[0.3em]">Recent downloads</p>
      {recent.length === 0 ? (
        <p className="mt-4 text-sm">No downloads yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#111] text-[10px] uppercase tracking-[0.2em]">
                <th className="py-2 pr-4 font-normal">When (PT)</th>
                <th className="py-2 pr-4 font-normal">From</th>
                <th className="py-2 pr-4 font-normal">Location</th>
                <th className="py-2 font-normal">Device</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((item, index) => (
                <tr key={`${item.at}-${index}`} className="border-b border-[#212529]/15">
                  <td className="whitespace-nowrap py-2 pr-4">{timeFormatter.format(new Date(item.at))}</td>
                  <td className="py-2 pr-4">{item.referrer}</td>
                  <td className="py-2 pr-4">{[item.city, item.country].filter(Boolean).join(', ') || 'Unknown'}</td>
                  <td className="py-2">{item.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default async function AdminPage({ searchParams }: { searchParams: { error?: string } }) {
  const signedIn = await isAdminToken(cookies().get(ADMIN_COOKIE)?.value)

  if (!signedIn) {
    return (
      <Shell>
        <h1 className="mb-8 text-3xl font-bold">Owner sign-in</h1>
        <LoginCard error={searchParams.error} />
      </Shell>
    )
  }

  let stats: ResumeStats | null = null
  let failed = false
  try {
    stats = await getResumeStats()
  } catch {
    console.error('Failed to read resume stats')
    failed = true
  }

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Resume downloads</h1>
          <p className="mt-2 text-[11px]">
            Counts every open of <a href={RESUME_PATH} className="underline hover:text-[#7209b7]">{RESUME_PATH}</a>. Your own clicks are not counted.
          </p>
        </div>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="border border-[#111] px-4 py-2 text-[10px] uppercase tracking-[0.3em] hover:border-[#7209b7] hover:text-[#7209b7]">
            Sign out
          </button>
        </form>
      </div>

      {!isStatsConfigured() && (
        <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
          <p className="text-sm">
            Storage is not connected. Add Upstash Redis to this project from the Vercel Marketplace (it sets KV_REST_API_URL and KV_REST_API_TOKEN), then redeploy.
          </p>
        </div>
      )}

      {failed && (
        <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
          <p className="text-sm">Could not load stats right now. Try refreshing in a minute.</p>
        </div>
      )}

      {stats && (
        <div className="space-y-8">
          <div className="border border-[#111] bg-[#f8f9fa] p-6 hard-shadow">
            <p className="text-[10px] uppercase tracking-[0.3em]">All time</p>
            <p className="mt-2 text-6xl font-bold">{stats.total.toLocaleString('en-US')}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Today" value={stats.today} />
            <StatTile label="Last 7 days" value={stats.last7Days} />
            <StatTile label="Bots and link previews" value={stats.bots} />
          </div>
          <DailyChart daily={stats.daily} />
          <RecentTable recent={stats.recent} />
        </div>
      )}
    </Shell>
  )
}
