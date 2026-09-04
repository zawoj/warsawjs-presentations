# Blank Reveal.js Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and run a Vite-powered Reveal.js presentation that renders exactly one empty white slide with no visible presentation chrome or motion.

**Architecture:** Vite serves a single HTML entry point containing the minimal Reveal.js wrapper. A small JavaScript entry imports Reveal.js and only its core layout stylesheet, then initializes the deck without plugins, theme, controls, progress, slide numbers, or transitions. A Playwright browser test verifies the user-visible blank-slide contract.

**Tech Stack:** Node.js 22, npm, Reveal.js 6.0.1, Vite 8.2.2, Playwright Test 1.62.1

**Spec:** `docs/superpowers/specs/2026-09-04-blank-revealjs-deck-design.md`

## Global Constraints

- Use the npm package for Reveal.js 6 with Vite.
- Render exactly one empty slide on a white canvas.
- Import only `reveal.js/dist/reveal.css`; do not import a Reveal.js theme or create a project stylesheet.
- Do not add presentation content, speaker notes, fonts, branding, plugins, layout primitives, CDN dependencies, or deployment configuration.
- Disable visible navigation controls, progress UI, slide numbers, and all visual transitions.

---

### Task 1: Blank Reveal.js presentation

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `playwright.config.js`
- Create: `tests/presentation.spec.js`
- Create: `index.html`
- Create: `src/main.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: Reveal.js default export and `reveal.js/dist/reveal.css`
- Produces: Vite application at `/`, `npm run dev`, `npm test`, and `npm run build`

- [ ] **Step 1: Add the dependency and test-runner configuration**

Create `package.json`:

```json
{
  "name": "warsawjs-presentations",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "test": "playwright test",
    "build": "vite build"
  },
  "dependencies": {
    "reveal.js": "6.0.1"
  },
  "devDependencies": {
    "@playwright/test": "1.62.1",
    "vite": "8.2.2"
  }
}
```

Create `playwright.config.js`:

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

Run `npm install` to create `package-lock.json` and install dependencies, then
run `npx playwright install chromium` to make the browser test runnable.

- [ ] **Step 2: Write the failing browser test**

Create `tests/presentation.spec.js`:

```javascript
import { expect, test } from '@playwright/test';

test('renders one empty white slide without visible presentation chrome', async ({ page }) => {
  await page.goto('/');

  const slide = page.locator('.reveal .slides > section');
  await expect(slide).toHaveCount(1);
  await expect(slide).toBeEmpty();
  await expect(page.locator('body')).toHaveText('');
  await expect(page.locator('.controls:visible, .progress:visible, .slide-number:visible')).toHaveCount(0);

  const canvasColor = await page.locator('body').evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  expect(canvasColor).toBe('rgb(255, 255, 255)');
});
```

- [ ] **Step 3: Run the test and verify the RED state**

Run: `npm test`

Expected: FAIL because the page does not yet contain a Reveal.js slide.

- [ ] **Step 4: Implement the minimal presentation**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WarsawJS Presentation</title>
  </head>
  <body>
    <div class="reveal">
      <div class="slides">
        <section></section>
      </div>
    </div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

Create `src/main.js`:

```javascript
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';

const deck = new Reveal({
  controls: false,
  progress: false,
  slideNumber: false,
  transition: 'none',
  backgroundTransition: 'none',
});

deck.initialize();
```

Replace `README.md` with:

````markdown
# WarsawJS presentations

## Development

```bash
npm install
npm run dev
```

The initial deck intentionally contains one completely blank slide. Add visual
direction only in later iterations.
````

- [ ] **Step 5: Verify the GREEN state and production build**

Run: `npm test`

Expected: PASS with one passing browser test.

Run: `npm run build`

Expected: exit code 0 and a production bundle in `dist/`.

- [ ] **Step 6: Run and inspect the presentation in T3 Code**

Start the retained server with:

```bash
npm run dev -- --host 127.0.0.1
```

Open the exact local URL reported by Vite in the T3 Code preview. Confirm that
the browser shows a completely white viewport with no text, controls, progress
bar, slide number, or transition.

- [ ] **Step 7: Commit the implementation**

```bash
git add package.json package-lock.json playwright.config.js tests/presentation.spec.js index.html src/main.js README.md
git commit -m "feat: add blank Reveal.js presentation"
```
