import { test, expect, describe, afterAll } from 'bun:test'
import { createPage } from './browser'

describe('E2E: Health endpoint', () => {
  test('returns status ok', async () => {
    const { page, cleanup } = await createPage()
    try {
      const body = await page.getResponseBody('/health')
      const data = JSON.parse(body)
      expect(data).toEqual({ status: 'ok' })
    } finally {
      cleanup()
    }
  })
})
