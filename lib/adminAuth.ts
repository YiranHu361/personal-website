// Owner-only session for private stats. Uses Web Crypto so it runs in both
// the edge middleware and Node route handlers.

export const ADMIN_COOKIE = 'yh_admin'
// Readable by client JS so the home page only asks for stats in the owner's browser.
export const ADMIN_UI_COOKIE = 'yh_admin_ui'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 180 // 180 days

const TOKEN_MESSAGE = 'resume-stats-admin-v1'

async function hmacHex(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

// Derived from the password, so changing ADMIN_PASSWORD signs out every browser.
export async function createAdminToken(): Promise<string | null> {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  return hmacHex(password, TOKEN_MESSAGE)
}

export async function isAdminToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const expected = await createAdminToken()
  return expected !== null && safeEqual(token, expected)
}

export async function isAdminPassword(input: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !input) return false
  // Compare fixed-length digests so the check doesn't leak the password length.
  const [given, expected] = await Promise.all([
    hmacHex(input, TOKEN_MESSAGE),
    hmacHex(password, TOKEN_MESSAGE),
  ])
  return safeEqual(given, expected)
}
