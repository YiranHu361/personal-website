import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, isAdminToken } from '@/lib/adminAuth'
import { getResumeStats } from '@/lib/resumeStats'

export const dynamic = 'force-dynamic'

const noStore = { 'Cache-Control': 'no-store' }

export async function GET() {
  // Anyone without the owner cookie gets a plain 404, so the endpoint stays hidden
  if (!(await isAdminToken(cookies().get(ADMIN_COOKIE)?.value))) {
    return new NextResponse('Not Found', { status: 404, headers: noStore })
  }

  try {
    const stats = await getResumeStats(5)
    if (!stats) {
      return NextResponse.json({ configured: false }, { headers: noStore })
    }
    return NextResponse.json({ configured: true, ...stats }, { headers: noStore })
  } catch {
    console.error('Failed to read resume stats')
    return NextResponse.json({ error: 'unavailable' }, { status: 502, headers: noStore })
  }
}
