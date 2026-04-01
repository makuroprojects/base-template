/**
 * Lightpanda browser helper for E2E tests.
 * Lightpanda runs in Docker, so localhost is accessed via host.docker.internal.
 */

const WS_ENDPOINT = process.env.LIGHTPANDA_WS ?? 'ws://127.0.0.1:9222'
const APP_HOST = process.env.E2E_APP_HOST ?? 'http://host.docker.internal:3000'

export { APP_HOST }

interface CDPResponse {
  id?: number
  method?: string
  params?: Record<string, any>
  result?: Record<string, any>
  error?: { code: number; message: string }
  sessionId?: string
}

export class LightpandaPage {
  private ws: WebSocket
  private sessionId: string
  private idCounter = 1
  private pending = new Map<number, { resolve: (v: any) => void; reject: (e: Error) => void }>()
  private ready: Promise<void>

  constructor(ws: WebSocket, sessionId: string) {
    this.ws = ws
    this.sessionId = sessionId

    this.ws.addEventListener('message', (e) => {
      const data: CDPResponse = JSON.parse(e.data as string)
      if (data.id && this.pending.has(data.id)) {
        const p = this.pending.get(data.id)!
        this.pending.delete(data.id)
        if (data.error) p.reject(new Error(data.error.message))
        else p.resolve(data.result)
      }
    })

    // Enable page events
    this.ready = this.send('Page.enable').then(() => {})
  }

  private send(method: string, params: Record<string, any> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.idCounter++
      this.pending.set(id, { resolve, reject })
      this.ws.send(JSON.stringify({ id, method, params, sessionId: this.sessionId }))
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id)
          reject(new Error(`CDP timeout: ${method}`))
        }
      }, 15000)
    })
  }

  async goto(path: string): Promise<void> {
    const url = path.startsWith('http') ? path : `${APP_HOST}${path}`
    await this.ready
    const result = await this.send('Page.navigate', { url })
    if (result?.errorText) throw new Error(`Navigation failed: ${result.errorText}`)
    // Wait for load
    await new Promise(r => setTimeout(r, 1500))
  }

  async evaluate<T = any>(expression: string): Promise<T> {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (result?.exceptionDetails) {
      throw new Error(`Evaluate error: ${result.exceptionDetails.text || JSON.stringify(result.exceptionDetails)}`)
    }
    return result?.result?.value as T
  }

  async title(): Promise<string> {
    return this.evaluate('document.title')
  }

  async textContent(selector: string): Promise<string | null> {
    return this.evaluate(`document.querySelector('${selector}')?.textContent ?? null`)
  }

  async getAttribute(selector: string, attr: string): Promise<string | null> {
    return this.evaluate(`document.querySelector('${selector}')?.getAttribute('${attr}') ?? null`)
  }

  async querySelectorAll(selector: string, property = 'textContent'): Promise<string[]> {
    return this.evaluate(`Array.from(document.querySelectorAll('${selector}')).map(el => el.${property})`)
  }

  async url(): Promise<string> {
    return this.evaluate('window.location.href')
  }

  async getResponseBody(path: string): Promise<string> {
    const url = path.startsWith('http') ? path : `${APP_HOST}${path}`
    await this.goto(url)
    return this.evaluate('document.body.innerText')
  }

  async setCookie(name: string, value: string): Promise<void> {
    await this.send('Network.setCookie', {
      name,
      value,
      domain: new URL(APP_HOST).hostname,
      path: '/',
    })
  }
}

export async function createPage(): Promise<{ page: LightpandaPage; cleanup: () => void }> {
  const ws = new WebSocket(WS_ENDPOINT)

  await new Promise<void>((resolve, reject) => {
    ws.onopen = () => resolve()
    ws.onerror = () => reject(new Error(`Cannot connect to Lightpanda at ${WS_ENDPOINT}`))
  })

  // Create target
  const targetId = await new Promise<string>((resolve, reject) => {
    const id = 1
    ws.send(JSON.stringify({ id, method: 'Target.createTarget', params: { url: 'about:blank' } }))
    const handler = (e: MessageEvent) => {
      const data: CDPResponse = JSON.parse(e.data as string)
      if (data.id === id) {
        ws.removeEventListener('message', handler)
        if (data.error) reject(new Error(data.error.message))
        else resolve(data.result!.targetId)
      }
    }
    ws.addEventListener('message', handler)
  })

  // Attach to target
  const sessionId = await new Promise<string>((resolve, reject) => {
    const id = 2
    ws.send(JSON.stringify({ id, method: 'Target.attachToTarget', params: { targetId, flatten: true } }))
    const handler = (e: MessageEvent) => {
      const data: CDPResponse = JSON.parse(e.data as string)
      if (data.id === id) {
        ws.removeEventListener('message', handler)
        if (data.error) reject(new Error(data.error.message))
        else resolve(data.result!.sessionId)
      }
    }
    ws.addEventListener('message', handler)
  })

  const page = new LightpandaPage(ws, sessionId)

  return {
    page,
    cleanup: () => {
      try { ws.close() } catch {}
    },
  }
}
