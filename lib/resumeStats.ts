// Resume download counter backed by Upstash Redis over its REST API.
// Works with Vercel's Upstash integration (KV_REST_API_*) or a direct Upstash
// database (UPSTASH_REDIS_REST_*). Without either, recording is a no-op.

export const RESUME_PATH = '/Yiran_Hu_Resume.pdf'

const TOTAL_KEY = 'resume:downloads:total'
const BOTS_KEY = 'resume:downloads:bots'
const DAILY_KEY = 'resume:downloads:daily'
const RECENT_KEY = 'resume:downloads:recent'
const RECENT_LIMIT = 100
const TIME_ZONE = 'America/Los_Angeles'

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|skype|curl|wget|python|axios|node-fetch|go-http|headless|lighthouse/i

export interface ResumeDownload {
  at: string
  referrer: string
  device: 'mobile' | 'desktop'
  country?: string
  city?: string
}

export interface ResumeStats {
  total: number
  bots: number
  today: number
  last7Days: number
  daily: { date: string; count: number }[]
  recent: ResumeDownload[]
}

export interface ResumeVisit {
  userAgent: string
  referrer: string | null
  country?: string | null
  city?: string | null
}

type RedisCommand = (string | number)[]

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url: url.replace(/\/$/, ''), token } : null
}

export function isStatsConfigured(): boolean {
  return redisConfig() !== null
}

async function pipeline(commands: RedisCommand[]): Promise<unknown[] | null> {
  const config = redisConfig()
  if (!config) return null

  const response = await fetch(`${config.url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new Error(`Redis request failed with status ${response.status}`)
  }

  const replies = (await response.json()) as { result?: unknown; error?: string }[]
  return replies.map((reply) => {
    if (reply.error) throw new Error(reply.error)
    return reply.result
  })
}

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// YYYY-MM-DD in Pacific time
function dayKey(date: Date): string {
  return dayFormatter.format(date)
}

function lastDays(count: number, now: Date): string[] {
  // Step back from noon UTC of today's Pacific date so DST never skips a day.
  const anchor = new Date(`${dayKey(now)}T12:00:00Z`)
  const days: string[] = []
  for (let i = count - 1; i >= 0; i--) {
    days.push(new Date(anchor.getTime() - i * 86_400_000).toISOString().slice(0, 10))
  }
  return days
}

function referrerHost(referrer: string | null): string {
  if (!referrer) return 'direct'
  try {
    return new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    return 'direct'
  }
}

function decodeHeader(value: string | null | undefined): string | undefined {
  if (!value) return undefined
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT_PATTERN.test(userAgent)
}

export async function recordResumeDownload(visit: ResumeVisit): Promise<void> {
  if (isBot(visit.userAgent)) {
    await pipeline([['INCR', BOTS_KEY]])
    return
  }

  const now = new Date()
  const entry: ResumeDownload = {
    at: now.toISOString(),
    referrer: referrerHost(visit.referrer),
    device: /mobile|iphone|ipad|android/i.test(visit.userAgent) ? 'mobile' : 'desktop',
    country: decodeHeader(visit.country),
    city: decodeHeader(visit.city),
  }

  await pipeline([
    ['INCR', TOTAL_KEY],
    ['HINCRBY', DAILY_KEY, dayKey(now), 1],
    ['LPUSH', RECENT_KEY, JSON.stringify(entry)],
    ['LTRIM', RECENT_KEY, 0, RECENT_LIMIT - 1],
  ])
}

export async function getResumeStats(recentCount = 25): Promise<ResumeStats | null> {
  const replies = await pipeline([
    ['GET', TOTAL_KEY],
    ['GET', BOTS_KEY],
    ['HGETALL', DAILY_KEY],
    ['LRANGE', RECENT_KEY, 0, recentCount - 1],
  ])
  if (!replies) return null

  const [total, bots, dailyFlat, recentRaw] = replies

  // HGETALL comes back as a flat [field, value, field, value, ...] list
  const dailyCounts = new Map<string, number>()
  const flat = Array.isArray(dailyFlat) ? (dailyFlat as string[]) : []
  for (let i = 0; i + 1 < flat.length; i += 2) {
    dailyCounts.set(flat[i], Number(flat[i + 1]) || 0)
  }

  const daily = lastDays(14, new Date()).map((date) => ({ date, count: dailyCounts.get(date) ?? 0 }))

  const recent: ResumeDownload[] = []
  for (const item of Array.isArray(recentRaw) ? (recentRaw as string[]) : []) {
    try {
      recent.push(JSON.parse(item) as ResumeDownload)
    } catch {
      // skip malformed entries
    }
  }

  return {
    total: Number(total) || 0,
    bots: Number(bots) || 0,
    today: daily[daily.length - 1].count,
    last7Days: daily.slice(-7).reduce((sum, day) => sum + day.count, 0),
    daily,
    recent,
  }
}
