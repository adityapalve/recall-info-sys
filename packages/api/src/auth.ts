import { createRemoteJWKSet, jwtVerify } from 'jose'
import { z } from 'zod'

export type ApiEnv = Env & { GOOGLE_CLIENT_ID?: string; GOOGLE_CLIENT_SECRET?: string }
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
export function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}
export async function hash(value: string) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
}
export function cookie(request: Request, name: string) {
  return (
    (request.headers.get('Cookie') ?? '')
      .split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? ''
  )
}
function setCookie(name: string, value: string, maxAge: number) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}
export const sessionCookie = (value: string, age = 2592000) =>
  setCookie('__Host-recall', value, age)
export async function currentUser(request: Request, env: ApiEnv) {
  const token = cookie(request, '__Host-recall')
  if (!token || token.length > 100) return null
  return env.DB.prepare(
    'SELECT u.id, u.email FROM auth_sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?',
  )
    .bind(await hash(token), Date.now())
    .first<{ id: string; email: string }>()
}
export function configured(env: ApiEnv) {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
}
export async function login(env: ApiEnv, origin: string) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
    return Response.json({ error: 'Google sign-in needs configuration' }, { status: 503 })
  const state = randomToken(),
    verifier = randomToken(),
    nonce = randomToken()
  const challenge = btoa(
    String.fromCharCode(
      ...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))),
    ),
  )
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  await env.DB.batch([
    env.DB.prepare('DELETE FROM oauth_states WHERE expires_at<?').bind(Date.now()),
    env.DB.prepare('INSERT INTO oauth_states VALUES (?,?,?,?)').bind(
      await hash(state),
      verifier,
      nonce,
      Date.now() + 600000,
    ),
  ])
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.search = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${origin}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }).toString()
  return new Response(null, {
    status: 302,
    headers: { Location: url.href, 'Set-Cookie': setCookie('__Host-recall-oauth', state, 600) },
  })
}
const tokenResponse = z.object({ id_token: z.string() })
export async function callback(request: Request, env: ApiEnv, origin: string) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET)
    return new Response('Sign-in is not configured', { status: 503 })
  const url = new URL(request.url),
    state = url.searchParams.get('state'),
    code = url.searchParams.get('code')
  if (!state || !code || state !== cookie(request, '__Host-recall-oauth'))
    return new Response('Sign-in expired. Please try again.', { status: 400 })
  const record = await env.DB.prepare(
    'DELETE FROM oauth_states WHERE state_hash=? AND expires_at>? RETURNING verifier,nonce',
  )
    .bind(await hash(state), Date.now())
    .first<{ verifier: string; nonce: string }>()
  if (!record) return new Response('Sign-in expired. Please try again.', { status: 400 })
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${origin}/api/auth/callback`,
      grant_type: 'authorization_code',
      code_verifier: record.verifier,
    }),
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) return new Response('Google sign-in failed. Please try again.', { status: 401 })
  const { id_token } = tokenResponse.parse(await response.json())
  const { payload } = await jwtVerify(id_token, googleKeys, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: env.GOOGLE_CLIENT_ID,
    algorithms: ['RS256'],
  })
  const claims = z
    .object({
      sub: z.string().min(1),
      email: z.string().email(),
      email_verified: z.literal(true),
      nonce: z.literal(record.nonce),
    })
    .parse(payload)
  if (env.ALLOWED_EMAIL && claims.email.toLowerCase() !== env.ALLOWED_EMAIL.toLowerCase())
    return new Response('This Recall instance is private to its owner.', { status: 403 })
  const token = randomToken()
  await env.DB.batch([
    env.DB.prepare(
      'INSERT INTO users (id,email) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email',
    ).bind(claims.sub, claims.email),
    env.DB.prepare('DELETE FROM auth_sessions WHERE expires_at<?').bind(Date.now()),
    env.DB.prepare('INSERT INTO auth_sessions VALUES (?,?,?)').bind(
      await hash(token),
      claims.sub,
      Date.now() + 2592000000,
    ),
  ])
  const headers = new Headers({ Location: '/', 'Set-Cookie': sessionCookie(token) })
  headers.append('Set-Cookie', setCookie('__Host-recall-oauth', '', 0))
  return new Response(null, { status: 302, headers })
}
