import { test, expect, describe, beforeAll, afterAll } from 'bun:test'
import { createTestApp, seedTestUser, createTestSession, cleanupTestData, prisma } from '../helpers'

const app = createTestApp()

let testUserId: string

beforeAll(async () => {
  await cleanupTestData()
  const user = await seedTestUser('session-test@example.com', 'pass123', 'Session Tester')
  testUserId = user.id
})

afterAll(async () => {
  await cleanupTestData()
  await prisma.$disconnect()
})

describe('GET /api/auth/session', () => {
  test('returns 401 without cookie', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/session'))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.user).toBeNull()
  })

  test('returns 401 with invalid token', async () => {
    const res = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: 'session=invalid-token-12345' },
    }))
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.user).toBeNull()
  })

  test('returns user with valid session', async () => {
    const token = await createTestSession(testUserId)
    const res = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: `session=${token}` },
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.user).toBeDefined()
    expect(body.user.email).toBe('session-test@example.com')
    expect(body.user.name).toBe('Session Tester')
    expect(body.user.id).toBe(testUserId)
    expect(body.user.role).toBe('USER')
  })

  test('returns 401 and deletes expired session', async () => {
    const expiredDate = new Date(Date.now() - 1000) // 1 second ago
    const token = await createTestSession(testUserId, expiredDate)

    const res = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: `session=${token}` },
    }))

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.user).toBeNull()

    // Verify expired session was deleted from DB
    const session = await prisma.session.findUnique({ where: { token } })
    expect(session).toBeNull()
  })
})
