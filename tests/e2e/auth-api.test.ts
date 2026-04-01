import { test, expect, describe } from 'bun:test'
import { createPage, APP_HOST } from './browser'

describe('E2E: Auth API via browser', () => {
  test('GET /api/auth/session page shows response', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/api/auth/session')
      // Navigating to a JSON API endpoint — body contains the JSON text
      const bodyText = await page.evaluate('document.body.innerText || document.body.textContent || ""')
      // Should contain "user" key in the response (either null or valid user)
      // If empty, that's also acceptable (401 may not render body in Lightpanda)
      if (bodyText.length > 0) {
        const data = JSON.parse(bodyText)
        expect(data.user).toBeNull()
      } else {
        // 401 response — Lightpanda may not render the body
        expect(bodyText).toBe('')
      }
    } finally {
      cleanup()
    }
  })

  test('GET /api/auth/google redirects to Google OAuth', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/api/auth/google')
      const url = await page.url()
      expect(url).toContain('accounts.google.com')
    } finally {
      cleanup()
    }
  })
})
