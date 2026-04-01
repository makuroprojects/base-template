import { test, expect, describe, beforeAll, afterAll } from 'bun:test'
import { createTestApp, seedTestUser, cleanupTestData, prisma } from '../helpers'

const app = createTestApp()

beforeAll(async () => {
  await cleanupTestData()
  await seedTestUser('flow@example.com', 'flow123', 'Flow User')
})

afterAll(async () => {
  await cleanupTestData()
  await prisma.$disconnect()
})

describe('Full auth flow: login → session → logout → session', () => {
  test('complete auth lifecycle', async () => {
    // 1. Login
    const loginRes = await app.handle(new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'flow@example.com', password: 'flow123' }),
    }))
    expect(loginRes.status).toBe(200)

    const loginBody = await loginRes.json()
    expect(loginBody.user.email).toBe('flow@example.com')
    expect(loginBody.user.role).toBe('USER')

    const setCookie = loginRes.headers.get('set-cookie')!
    const token = setCookie.match(/session=([^;]+)/)?.[1]!
    expect(token).toBeDefined()

    // 2. Check session — should be valid
    const sessionRes = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: `session=${token}` },
    }))
    expect(sessionRes.status).toBe(200)
    const sessionBody = await sessionRes.json()
    expect(sessionBody.user.email).toBe('flow@example.com')

    // 3. Logout
    const logoutRes = await app.handle(new Request('http://localhost/api/auth/logout', {
      method: 'POST',
      headers: { cookie: `session=${token}` },
    }))
    expect(logoutRes.status).toBe(200)

    // 4. Check session again — should be invalid
    const afterLogoutRes = await app.handle(new Request('http://localhost/api/auth/session', {
      headers: { cookie: `session=${token}` },
    }))
    expect(afterLogoutRes.status).toBe(401)
    const afterLogoutBody = await afterLogoutRes.json()
    expect(afterLogoutBody.user).toBeNull()
  })
})
