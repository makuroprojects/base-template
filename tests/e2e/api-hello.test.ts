import { test, expect, describe } from 'bun:test'
import { createPage } from './browser'

describe('E2E: Hello API via browser', () => {
  test('GET /api/hello returns message', async () => {
    const { page, cleanup } = await createPage()
    try {
      const body = await page.getResponseBody('/api/hello')
      const data = JSON.parse(body)
      expect(data).toEqual({ message: 'Hello, world!', method: 'GET' })
    } finally {
      cleanup()
    }
  })

  test('GET /api/hello/:name returns personalized message', async () => {
    const { page, cleanup } = await createPage()
    try {
      const body = await page.getResponseBody('/api/hello/Bun')
      const data = JSON.parse(body)
      expect(data).toEqual({ message: 'Hello, Bun!' })
    } finally {
      cleanup()
    }
  })
})
