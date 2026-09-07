import { mkdir } from 'node:fs/promises'

import { chromium } from '../demo/payload-warsawjs/node_modules/@playwright/test/index.mjs'

const baseURL = process.env.DECK_URL || 'http://localhost:5173'
const outputDir = process.env.DECK_QA_DIR || '/tmp/payload-deck-qa'
const cases = Array.from({ length: 21 }, (_, index) => ({ id: index + 1, h: index, v: 0 }))
cases.push({ id: 4, h: 3, v: 1 }, { id: 6, h: 5, v: 1 })

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
const failures = []

for (const entry of cases) {
  await page.goto(`${baseURL}/#/${entry.h}/${entry.v}`)
  await page.waitForSelector(`section[data-slide-id="${String(entry.id).padStart(2, '0')}"].present`)
  await page.waitForTimeout(1200)

  const result = await page.evaluate((slideID) => {
    const sections = [...document.querySelectorAll(`section[data-slide-id="${slideID}"].present`)]
    const section = sections.at(-1)
    const selectors = 'h1, .content-head, .grid-window, .file-tree-panel, .evidence-frame, .framework-map, .agent-context, .future-content, .stat-grid, .quiz-list'
    const clipped = [...section.querySelectorAll(selectors)]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.left < -2 || rect.top < -2 || rect.right > innerWidth + 2 || rect.bottom > innerHeight + 2
      })
      .map((element) => ({ className: element.className, tag: element.tagName }))

    return { clipped, notes: section.querySelectorAll('aside.notes').length }
  }, String(entry.id).padStart(2, '0'))

  if (result.notes !== 1 || result.clipped.length) failures.push({ ...entry, ...result })

  const suffix = entry.v ? `-${entry.v + 1}` : ''
  await page.screenshot({ path: `${outputDir}/slide-${String(entry.id).padStart(2, '0')}${suffix}.png` })
}

const readCodeWindowRect = async (slideID, h, v) => {
  await page.goto(`${baseURL}/#/${h}/${v}`)
  const selector = `section[data-slide-id="${String(slideID).padStart(2, '0')}"].present > .slide-grid .grid-window`
  await page.waitForSelector(selector)
  await page.waitForTimeout(1200)
  return page.locator(selector).boundingBox()
}

for (const [slideID, h] of [
  [4, 3],
  [6, 5],
]) {
  const first = await readCodeWindowRect(slideID, h, 0)
  const second = await readCodeWindowRect(slideID, h, 1)
  const deltas = Object.keys(first).map((key) => Math.abs(first[key] - second[key]))
  if (Math.max(...deltas) > 1) failures.push({ slideID, issue: 'code window moves between Auto-Animate steps', first, second })
}

await page.goto(`${baseURL}/#/20/0`)
await page.waitForSelector('section.present .quiz-list')
for (let expected = 1; expected <= 3; expected += 1) {
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(100)
  const visible = await page.locator('section.present .quiz-question.visible').count()
  if (visible !== expected) failures.push({ slideID: 21, issue: 'quiz fragment sequence', expected, visible })
}

await browser.close()

if (failures.length) {
  console.error(JSON.stringify(failures, null, 2))
  process.exitCode = 1
} else {
  console.log(`Visual bounds and notes valid for ${cases.length} rendered states. Screenshots: ${outputDir}`)
}
