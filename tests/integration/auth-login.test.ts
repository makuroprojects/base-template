import { test, expect, describe, beforeAll, afterAll } from 'bun:test'
import { createTestApp, seedTestUser, cleanupTestData, prisma } from '../helpers'

const app = createTestApp()

beforeAll(async () => {
  await cleanupTestData()
  await seedTestUser('admin@example.com', 'admin123', 'Admin')
  await seedTestUser('user@example.com', 'user123', 'User')
})

afterAll(async () => {
  await cleanupTestData()
  await prisma.$disconnect()
})

describe('POST /api/auth/login', () => {
  test('login with valid credentials returns user and session cookie', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user).toBeDefined()
    expect(body.user.email).toBe('admin@example.com')
    expect(body.user.name).toBe('Admin')
    expect(body.user.id).toBeDefined()
    expect(body.user.role).toBe('USER')
    // Should not expose password
    expect(body.user.password).toBeUndefined()

    // Check session cookie
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain('session=')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Path=/')
  })

  test('login with wrong password returns 401', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'wrongpassword' }),
    }))

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Email atau password salah')
  })

  test('login with non-existent email returns 401', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@example.com', password: 'anything' }),
    }))

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toBe('Email atau password salah')
  })

  test('login returns role field in response', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'user123' }),
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user.role).toBe('USER')
  })

  test('login creates a session in database', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'user123' }),
    }))

    expect(res.status).toBe(200)

    const setCookie = res.headers.get('set-cookie')!
    const token = setCookie.match(/session=([^;]+)/)?.[1]
    expect(token).toBeDefined()

    // Verify session exists in DB
    const session = await prisma.session.findUnique({ where: { token: token! } })
    expect(session).not.toBeNull()
    expect(session!.expiresAt.getTime()).toBeGreaterThan(Date.now())
  })
})
