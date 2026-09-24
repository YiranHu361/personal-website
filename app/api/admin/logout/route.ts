import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, ADMIN_UI_COOKIE } from '@/lib/adminAuth'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  const expired = { secure: true, sameSite: 'lax' as const, path: '/', maxAge: 0 }
  response.cookies.set(ADMIN_COOKIE, '', { ...expired, httpOnly: true })
  response.cookies.set(ADMIN_UI_COOKIE, '', expired)
  return response
}
