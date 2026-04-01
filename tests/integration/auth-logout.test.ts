import { test, expect, describe, beforeAll, afterAll } from 'bun:test'
import { createTestApp, seedTestUser, createTestSession, cleanupTestData, prisma } from '../helpers'

const app = createTestApp()

let testUserId: string

beforeAll(async () => {
  await cleanupTestData()
  const user = await seedTestUser('logout-test@example.com', 'pass123', 'Logout Tester')
  testUserId = user.id
})

afterAll(async () => {
  await cleanupTestData()
  await prisma.$disconnect()
})

describe('POST /api/auth/logout', () => {
  test('logout clears session cookie', async () => {
    const token = await createTestSession(testUserId)
    const res = await app.handle(new Request('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: { cookie: `session=${token}` },
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)

    // Cookie should be cleared
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain('session=;')
    expect(setCookie).toContain('Max-Age=0')
  })

  test('logout deletes session from database', async () => {
    const token = await createTestSession(testUserId)

    // Verify session exists
    let session = await prisma.session.findUnique({ where: { token } })
    expect(session).not.toBeNull()

    await app.handle(new Request('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: { cookie: `session=${token}` },
    }))

    // Verify session deleted
    session = await prisma.session.findUnique({ where: { token } })
    expect(session).toBeNull()
  })

  test('logout without cookie still returns ok', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/logout', {
      method: 'POST',
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('session is invalid after logout', async () => {
    const token = await createTestSession(testUserId)

    // Logout
    await app.handle(new Request('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: { cookie: `session=${token}` },
    }))

    // Try to use the same session
    const sessionRes = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: `session=${token}` },
    }))

    expect(sessionRes.status).toBe(401)
  })
})
