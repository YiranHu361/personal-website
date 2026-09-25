import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { ADMIN_COOKIE, isAdminToken } from '@/lib/adminAuth'
import { RESUME_PATH, recordResumeDownload } from '@/lib/resumeStats'

// Repeat opens from the same browser within this window count once
// (PDF viewers often re-request the file).
const SEEN_COOKIE = 'yh_resume_seen'
const SEEN_WINDOW_SECONDS = 30 * 60

function isPartialOrPrefetch(request: NextRequest): boolean {
  const range = request.headers.get('range')
  if (range && !range.startsWith('bytes=0-')) return true
  const purpose = request.headers.get('sec-purpose') ?? request.headers.get('purpose') ?? ''
  return purpose.includes('prefetch')
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()

  if (request.method !== 'GET' || isPartialOrPrefetch(request)) return response
  if (request.cookies.has(SEEN_COOKIE)) return response
  // Don't count the owner's own clicks
  if (await isAdminToken(request.cookies.get(ADMIN_COOKIE)?.value)) return response

  event.waitUntil(
    recordResumeDownload({
      userAgent: request.headers.get('user-agent') ?? '',
      referrer: request.headers.get('referer'),
      country: request.headers.get('x-vercel-ip-country'),
      city: request.headers.get('x-vercel-ip-city'),
    }).catch(() => {
      console.error('Failed to record resume download')
    })
  )

  response.cookies.set(SEEN_COOKIE, '1', {
    maxAge: SEEN_WINDOW_SECONDS,
    path: RESUME_PATH,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })
  return response
}

export const config = {
  matcher: ['/Yiran_Hu_Resume.pdf'],
}
