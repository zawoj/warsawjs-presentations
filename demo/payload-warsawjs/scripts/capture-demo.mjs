import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium } from '@playwright/test'

const baseURL = process.env.DEMO_URL || 'http://localhost:3001'
const dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(dirname, '../../../public/screenshots')
const admin = { email: 'admin@warsawjs.dev', password: 'PayloadDemo2026!' }
const editor = { email: 'editor@warsawjs.dev', password: 'PayloadDemo2026!' }

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await adminContext.newPage()

const waitForAdmin = async (targetPage) => {
  await targetPage.waitForLoadState('networkidle')
  await targetPage.locator('body').waitFor({ state: 'visible' })
}

const login = async (targetPage, user) => {
  await targetPage.goto(`${baseURL}/admin/login`)
  await waitForAdmin(targetPage)
  await targetPage.locator('input[name="email"]').fill(user.email)
  await targetPage.locator('input[name="password"]').fill(user.password)
  await targetPage.getByRole('button', { name: /login/i }).click()
  await targetPage.waitForURL((url) => url.pathname === '/admin')
  await waitForAdmin(targetPage)
}

await page.goto(`${baseURL}/admin`)
await waitForAdmin(page)

if (page.url().includes('create-first-user')) {
  await page.locator('input[name="email"]').fill(admin.email)
  await page.locator('input[name="password"]').fill(admin.password)
  await page.locator('input[name="confirm-password"]').fill(admin.password)
  await page.locator('.rs__control').click()
  await page.getByText('admin', { exact: true }).last().click()
  await page.getByRole('button', { name: 'Create', exact: true }).click()
  await page.waitForURL((url) => url.pathname === '/admin')
  await waitForAdmin(page)
} else if (page.url().includes('/login')) {
  await login(page, admin)
}

const loginContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const loginPage = await loginContext.newPage()
await loginPage.goto(`${baseURL}/admin/login`)
await waitForAdmin(loginPage)
await loginPage.screenshot({ path: path.join(outputDir, 'admin-login.png') })
await loginContext.close()

const getDocs = async (collection) => {
  const response = await page.request.get(`${baseURL}/api/${collection}?limit=100`)
  if (!response.ok()) throw new Error(`GET ${collection} failed: ${response.status()}`)
  return (await response.json()).docs
}

const ensureDocument = async (collection, key, data) => {
  const existing = (await getDocs(collection)).find((doc) => doc[key] === data[key])
  if (existing) return existing

  const response = await page.request.post(`${baseURL}/api/${collection}`, { data })
  if (!response.ok()) throw new Error(`POST ${collection} failed: ${response.status()} ${await response.text()}`)
  return (await response.json()).doc
}

const meetup = await ensureDocument('events', 'title', {
  title: 'WarsawJS Meetup #132',
  date: '2026-10-14T17:00:00.000Z',
  status: 'published',
})

await ensureDocument('events', 'title', {
  title: 'Payload CMS Workshop',
  date: '2026-11-05T17:00:00.000Z',
  status: 'draft',
})

await ensureDocument('users', 'email', {
  email: editor.email,
  password: editor.password,
  role: 'editor',
})

await page.goto(`${baseURL}/admin/collections/events/${meetup.id}`)
await waitForAdmin(page)
await page.screenshot({ path: path.join(outputDir, 'event-editor.png') })

const slugField = page.locator('input[name="slug"]')
if (await slugField.count()) await slugField.scrollIntoViewIfNeeded()
await page.screenshot({ path: path.join(outputDir, 'event-slug.png') })

await page.goto(`${baseURL}/admin/collections/events`)
await waitForAdmin(page)
await page.screenshot({ path: path.join(outputDir, 'status-cell.png') })

await page.goto(baseURL)
await page.getByText('WarsawJS Meetup #132').waitFor()
await page.screenshot({ path: path.join(outputDir, 'event-listing.png') })

const endpointResponse = await page.request.post(`${baseURL}/api/events/check-in`, {
  data: { eventID: meetup.id },
})
if (!endpointResponse.ok()) {
  throw new Error(`check-in failed: ${endpointResponse.status()} ${await endpointResponse.text()}`)
}
const endpointJSON = await endpointResponse.json()
await page.setContent(`<pre style="margin:0;padding:48px;background:#11161a;color:#8bddb2;font:24px/1.6 monospace;min-height:100vh">${JSON.stringify(endpointJSON, null, 2)}</pre>`)
await page.screenshot({ path: path.join(outputDir, 'check-in-response.png') })

const editorContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const editorPage = await editorContext.newPage()
await login(editorPage, editor)
await editorPage.goto(`${baseURL}/admin/collections/events`)
await waitForAdmin(editorPage)
await editorPage.screenshot({ path: path.join(outputDir, 'restricted-editor.png') })

await editorContext.close()
await adminContext.close()
await browser.close()

console.log(`Captured demo evidence in ${outputDir}`)
