import { test, expect, describe } from 'bun:test'
import { createPage, APP_HOST } from './browser'

describe('E2E: Landing page', () => {
  test('serves HTML with correct title', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST)
      const title = await page.title()
      expect(title).toBe('My App')
    } finally {
      cleanup()
    }
  })

  test('has dark color-scheme meta tag', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST)
      const meta = await page.evaluate('document.querySelector("meta[name=color-scheme]").content')
      expect(meta).toBe('dark')
    } finally {
      cleanup()
    }
  })

  test('splash screen removed after JS execution', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST)
      // Lightpanda executes JS, so splash should be gone
      const splashExists = await page.evaluate('document.getElementById("splash") !== null')
      expect(splashExists).toBe(false)
    } finally {
      cleanup()
    }
  })

  test('root div present', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST)
      const root = await page.evaluate('document.getElementById("root") !== null')
      expect(root).toBe(true)
    } finally {
      cleanup()
    }
  })
})
