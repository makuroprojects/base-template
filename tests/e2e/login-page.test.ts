import { test, expect, describe } from 'bun:test'
import { createPage, APP_HOST } from './browser'

describe('E2E: Login page', () => {
  test('serves HTML with correct title', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/login')
      const title = await page.title()
      expect(title).toBe('My App')
    } finally {
      cleanup()
    }
  })

  test('has dark theme set on html element', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/login')
      const colorScheme = await page.evaluate('document.documentElement.getAttribute("data-mantine-color-scheme")')
      expect(colorScheme).toBe('dark')
    } finally {
      cleanup()
    }
  })

  test('has dark background meta', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/login')
      const meta = await page.evaluate('document.querySelector("meta[name=color-scheme]").content')
      expect(meta).toBe('dark')
    } finally {
      cleanup()
    }
  })

  test('root element exists for React mount', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/login')
      const root = await page.evaluate('document.getElementById("root") !== null')
      expect(root).toBe(true)
    } finally {
      cleanup()
    }
  })

  test('splash removed after app load', async () => {
    const { page, cleanup } = await createPage()
    try {
      await page.goto(APP_HOST + '/login')
      const splashGone = await page.evaluate('document.getElementById("splash") === null')
      expect(splashGone).toBe(true)
    } finally {
      cleanup()
    }
  })
})
