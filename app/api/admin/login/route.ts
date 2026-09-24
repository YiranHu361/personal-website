import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_UI_COOKIE,
  createAdminToken,
  isAdminPassword,
} from '@/lib/adminAuth'

// Simple in-memory rate limiting (resets on server restart)
const attemptMap = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 5
const ATTEMPT_WINDOW = 15 * 60 * 1000 // 15 minutes in ms

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = attemptMap.get(ip)

  if (!record || now > record.resetTime) {
    attemptMap.set(ip, { count: 1, resetTime: now + ATTEMPT_WINDOW })
    return false
  }

  record.count++
  return record.count > MAX_ATTEMPTS
}

export async function POST(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.redirect(new URL('/admin?error=limit', request.url), 303)
  }

  const form = await request.formData().catch(() => null)
  const password = form?.get('password')

  if (typeof password !== 'string' || !(await isAdminPassword(password))) {
    return NextResponse.redirect(new URL('/admin?error=invalid', request.url), 303)
  }

  const token = await createAdminToken()
  if (!token) {
    return NextResponse.redirect(new URL('/admin', request.url), 303)
  }

  attemptMap.delete(ip)
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  const cookieOptions = { secure: true, sameSite: 'lax' as const, path: '/', maxAge: ADMIN_COOKIE_MAX_AGE }
  response.cookies.set(ADMIN_COOKIE, token, { ...cookieOptions, httpOnly: true })
  response.cookies.set(ADMIN_UI_COOKIE, '1', { ...cookieOptions, httpOnly: false })
  return response
}
