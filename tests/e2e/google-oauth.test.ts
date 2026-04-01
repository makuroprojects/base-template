import { test, expect, describe } from 'bun:test'
import { createPage, APP_HOST } from './browser'

describe('E2E: Google OAuth redirect', () => {
  test('navigating to /api/auth/google ends up at Google', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/api/auth/google')
      const url = await page.url()
      expect(url).toContain('accounts.google.com')
    } finally {
      cleanup()
    }
  })

  test('callback without code redirects to login error', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/api/auth/callback/google')
      const url = await page.url()
      expect(url).toContain('/login')
      expect(url).toContain('error=google_failed')
    } finally {
      cleanup()
    }
  })
})
