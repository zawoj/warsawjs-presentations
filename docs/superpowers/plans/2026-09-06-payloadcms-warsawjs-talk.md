# PayloadCMS WarsawJS Talk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete 21-slide Reveal.js draft and a real local Payload WarsawJS application that supplies verified code examples and authentic screenshots.

**Architecture:** Keep the Reveal deck independent from the demonstration project. The deck renders semantic slide markup from focused content and rendering modules, while `demo/payload-warsawjs/` is a disposable but buildable Payload fixture used to verify examples and create screenshots. Every demonstrated code change is paired with a screenshot or response that proves its effect.

**Tech Stack:** Reveal.js 6, Vite 8, vanilla JavaScript, CSS, Payload CMS blank template, Next.js App Router, TypeScript, SQLite, pnpm.

**Spec:** `docs/superpowers/specs/2026-09-06-payloadcms-warsawjs-talk-design.md`

## Global Constraints

- Presentation runtime is 25 minutes: 20 minutes of talk and 5 minutes of quiz; Q&A is separate.
- Visible slide copy is concise English; speaker notes are natural Polish.
- Use only the Grid design system documented in `DESIGN_SYSTEM.md`.
- Use 1920×1080 Reveal coordinates and the existing fade transitions.
- Keep `.grid-window` fixed at 530px with a 470px code viewport.
- Animate only code lines or tree entries, never the code-window shell.
- Each code change must have visible product evidence.
- Payload 4.0 is labeled `EARLY LOOK / WORK IN PROGRESS`.
- Slides 18, 20, and 21 remain visibly identifiable as mini drafts.
- Do not commit secrets, databases, generated runtime caches, or user-specific browser data.

## File Structure

- `src/main.js` — initialize Reveal and attach rendered deck markup.
- `src/slides/content.js` — slide copy, code samples, draft flags, and Polish speaker notes.
- `src/slides/render.js` — reusable renderers for title, assertion/evidence, code, screenshot, diagram, statistics, and quiz slides.
- `src/styles.css` — approved Grid tokens plus layouts for trees, screenshots, diagrams, stats, and draft placeholders.
- `scripts/validate-deck.mjs` — structural checks for slide IDs, notes, drafts, and required evidence links.
- `package.json` — add `validate` and `check` scripts.
- `public/screenshots/` — exported Admin/frontend/result screenshots only.
- `demo/payload-warsawjs/` — locally scaffolded Payload fixture.
- `demo/payload-warsawjs/src/collections/Events.ts` — event schema and slug hook.
- `demo/payload-warsawjs/src/collections/Users.ts` — authenticated users and roles.
- `demo/payload-warsawjs/src/access/eventAccess.ts` — typed event permissions.
- `demo/payload-warsawjs/src/components/EventStatusCell.tsx` — custom Admin status badge.
- `demo/payload-warsawjs/src/app/(frontend)/page.tsx` — WarsawJS event listing.
- Generated Payload routing/config files remain in the locations produced by the current blank template.

---

### Task 1: Scaffold and verify the Payload fixture

**Files:**
- Create: `demo/payload-warsawjs/` using the official blank template
- Modify: `demo/payload-warsawjs/.gitignore`

**Interfaces:**
- Consumes: current `create-payload-app` CLI
- Produces: a locally runnable Payload/Next.js project using pnpm and SQLite

- [ ] **Step 1: Record the current toolchain**

Run:

```bash
node --version
pnpm --version
npx create-payload-app@latest --help
```

Expected: Node satisfies the CLI requirement, pnpm is available, and the help output lists `blank` as a template.

- [ ] **Step 2: Scaffold the fixture**

Run the CLI from `demo/`, choose the project name `payload-warsawjs`, template `blank`, package manager `pnpm`, and database `SQLite`:

```bash
mkdir -p demo
cd demo
npx create-payload-app@latest -t blank
```

Expected: `demo/payload-warsawjs/package.json`, `src/payload.config.ts`, and the `(payload)` App Router group exist.

- [ ] **Step 3: Protect local state**

Add generated database files, `.env`, `.next/`, and browser/session artifacts to the fixture's `.gitignore`. Keep `.env.example` if generated.

- [ ] **Step 4: Verify the untouched fixture**

Run:

```bash
pnpm --dir demo/payload-warsawjs build
```

Expected: the official blank template builds before custom code is added.

- [ ] **Step 5: Commit the isolated fixture baseline**

```bash
git add demo/payload-warsawjs
git commit -m "chore: scaffold Payload WarsawJS demo"
```

---

### Task 2: Build the Events flow and public frontend

**Files:**
- Create: `demo/payload-warsawjs/src/collections/Events.ts`
- Modify: `demo/payload-warsawjs/src/payload.config.ts`
- Modify: `demo/payload-warsawjs/src/app/(frontend)/page.tsx`
- Generated: `demo/payload-warsawjs/src/payload-types.ts`

**Interfaces:**
- Produces: `Events` collection with `title`, `date`, `slug`, `status`, and a deterministic `beforeChange` slug hook
- Produces: frontend event cards queried through `getPayload()`

- [ ] **Step 1: Add the Event collection**

Create a typed `CollectionConfig` whose essential behavior is:

```ts
export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'slug', type: 'text', unique: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: ['draft', 'published'],
    },
  ],
}
```

Register `Events` in `payload.config.ts` without removing generated collections.

- [ ] **Step 2: Add the deterministic lifecycle hook**

Add a `beforeChange` hook that derives `slug` from `title` only when the caller has not supplied a slug:

```ts
beforeChange: [
  ({ data }) => ({
    ...data,
    slug: data.slug || data.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  }),
]
```

- [ ] **Step 3: Generate types and verify the schema**

Run the generated template's type-generation command, then confirm `Event` includes the five fields.

```bash
pnpm --dir demo/payload-warsawjs generate:types
rg -n "export interface Event|title:|date:|slug\?:|status\?:" demo/payload-warsawjs/src/payload-types.ts
```

Expected: generated `Event` type matches the collection.

- [ ] **Step 4: Query Events in a Server Component**

Use the fixture's config alias and Local API:

```tsx
const payload = await getPayload({ config })
const { docs: events } = await payload.find({
  collection: 'events',
  where: { status: { equals: 'published' } },
  sort: 'date',
})
```

Render a minimal WarsawJS schedule with title, date, and status. Keep visual styling screenshot-friendly and independent from the Reveal CSS.

- [ ] **Step 5: Build the completed flow**

```bash
pnpm --dir demo/payload-warsawjs build
```

Expected: TypeScript and Next.js build pass.

- [ ] **Step 6: Commit the Events flow**

```bash
git add demo/payload-warsawjs/src
git commit -m "feat: add WarsawJS events flow"
```

---

### Task 3: Add auth, access, custom endpoint, and Admin React extension

**Files:**
- Create: `demo/payload-warsawjs/src/collections/Users.ts`
- Create: `demo/payload-warsawjs/src/access/eventAccess.ts`
- Create: `demo/payload-warsawjs/src/components/EventStatusCell.tsx`
- Modify: `demo/payload-warsawjs/src/collections/Events.ts`
- Modify: `demo/payload-warsawjs/src/payload.config.ts`

**Interfaces:**
- Produces: `User.role` values `admin` and `editor`
- Produces: `canManageEvents: Access`
- Produces: authenticated `POST /api/events/check-in`
- Produces: `EventStatusCell` referenced through Payload's Admin component path

- [ ] **Step 1: Add authenticated users**

Implement:

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [{
    name: 'role',
    type: 'select',
    required: true,
    defaultValue: 'editor',
    options: ['admin', 'editor'],
  }],
}
```

Register `Users` and set `admin.user: 'users'` in the Payload config.

- [ ] **Step 2: Add typed event access**

Implement `canManageEvents` so admins receive `true`, unauthenticated users receive `false`, and editors receive a row constraint compatible with the final schema. Attach it to Event create/update/delete access. Public read remains limited to published events.

- [ ] **Step 3: Add an authenticated check-in endpoint**

Attach a collection endpoint at `/check-in` using `method: 'post'`. Return `401` without `req.user`; otherwise return JSON containing `ok: true`, `eventID`, and the authenticated user's ID. Validate the event ID from the request body before returning success.

- [ ] **Step 4: Add the React status cell**

Create a client component that maps `draft` and `published` to short text badges. Register it as the status field's Admin cell component using the generated template's component import-map syntax.

- [ ] **Step 5: Regenerate types and run the fixture build**

```bash
pnpm --dir demo/payload-warsawjs generate:types
pnpm --dir demo/payload-warsawjs build
```

Expected: generated roles are typed, component imports resolve, and the build passes.

- [ ] **Step 6: Commit framework capabilities**

```bash
git add demo/payload-warsawjs/src
git commit -m "feat: demonstrate Payload framework capabilities"
```

---

### Task 4: Create real demonstration data and screenshots

**Files:**
- Create: `public/screenshots/event-editor.png`
- Create: `public/screenshots/event-listing.png`
- Create: `public/screenshots/event-slug.png`
- Create: `public/screenshots/admin-login.png`
- Create: `public/screenshots/restricted-editor.png`
- Create: `public/screenshots/check-in-response.png`
- Create: `public/screenshots/status-cell.png`
- Create: `public/screenshots/payload-4-placeholder.svg`

**Interfaces:**
- Consumes: running fixture from Tasks 1–3
- Produces: stable 16:9 or tightly cropped visual evidence for deck slides

- [ ] **Step 1: Start the fixture and create deterministic data**

Run the project over HTTP, create one admin and one editor account, then add at least two events:

```text
WarsawJS Meetup #132 — 2026-10-14 — published
Payload CMS Workshop — 2026-11-05 — draft
```

Use non-sensitive local-only credentials.

- [ ] **Step 2: Capture Admin and frontend evidence**

Capture the editor form, derived slug, login state, restricted editor state,
custom status cell, and frontend event listing. Crop each image to the relevant
UI at a readable scale and save under the exact filenames listed above.

- [ ] **Step 3: Capture endpoint evidence**

Call the authenticated `/check-in` endpoint and capture a browser-readable JSON
response that includes `ok`, `eventID`, and `userID`. Do not expose the token or
cookies in the screenshot.

- [ ] **Step 4: Add the Payload 4.0 placeholder**

Create a Grid-styled SVG placeholder labeled `OFFICIAL 4.0 SCREENSHOT` and
`EARLY LOOK / WORK IN PROGRESS`. This remains until an official image is chosen.

- [ ] **Step 5: Verify image integrity**

```bash
file public/screenshots/*
```

Expected: seven PNG images and one SVG, with no empty files.

- [ ] **Step 6: Commit screenshot evidence**

```bash
git add public/screenshots
git commit -m "docs: add Payload demonstration screenshots"
```

---

### Task 5: Build reusable deck content and rendering modules

**Files:**
- Create: `src/slides/content.js`
- Create: `src/slides/render.js`
- Create: `scripts/validate-deck.mjs`
- Modify: `src/main.js`
- Modify: `package.json`

**Interfaces:**
- Produces: `slides` array with objects `{ id, type, title, note, draft?, ... }`
- Produces: `renderDeck(slides): string`
- Consumes: screenshot paths under `/screenshots/`

- [ ] **Step 1: Write the structural validator first**

Create `scripts/validate-deck.mjs` that imports `slides` and fails unless:

```js
assert.equal(slides.length, 21)
assert.deepEqual(slides.map(({ id }) => id), Array.from({ length: 21 }, (_, i) => i + 1))
assert.ok(slides.every(({ title, note }) => title.trim() && note.trim()))
assert.deepEqual(slides.filter(({ draft }) => draft).map(({ id }) => id), [18, 20, 21])
```

Also assert that evidence slides 5, 8, 10, 11, 13, 14, and 15 contain a screenshot path.

- [ ] **Step 2: Run the validator and observe the expected failure**

```bash
node scripts/validate-deck.mjs
```

Expected: failure because `src/slides/content.js` does not exist.

- [ ] **Step 3: Create the 21-slide content model**

Transcribe the approved sequence from the spec. Use short English assertions,
verified TypeScript snippets from the fixture, and Polish notes containing the
spoken transitions. Draft slides still receive short placeholder notes so speaker
view remains structurally complete.

- [ ] **Step 4: Create semantic slide renderers**

Implement focused renderer functions for `title`, `tree`, `code`, `screenshot`,
`split`, `diagram`, `stats`, and `quiz`. Each renderer must include:

```html
<section data-background-color="#e9edef" data-slide-id="01">
  <div class="blueprint-grid" aria-hidden="true"></div>
  <!-- visible content -->
  <aside class="notes">Polish speaker notes</aside>
</section>
```

Use nested vertical sections only for file-tree or code steps that need
Auto-Animate. Preserve horizontal IDs for the narrative order.

- [ ] **Step 5: Simplify the entry point**

Make `src/main.js` import `slides` and `renderDeck`, assign the rendered markup
to `.slides`, and retain the approved Reveal initialization and Highlight plugin.

- [ ] **Step 6: Add validation scripts and run them**

Add:

```json
"validate": "node scripts/validate-deck.mjs",
"check": "npm run validate && npm run build"
```

Run:

```bash
npm run check
```

Expected: 21-slide validation and Vite production build both pass.

- [ ] **Step 7: Commit the deck structure**

```bash
git add src/main.js src/slides scripts/validate-deck.mjs package.json
git commit -m "feat: add Payload talk slide structure"
```

---

### Task 6: Implement Grid layouts and draft states

**Files:**
- Modify: `src/styles.css`
- Modify: `DESIGN_SYSTEM.md` only if a newly approved reusable component is introduced

**Interfaces:**
- Consumes: semantic classes emitted by `render.js`
- Produces: stable 1920×1080 layouts for all eight slide types

- [ ] **Step 1: Add the file-tree and code/evidence layouts**

Add styles for `.file-tree`, `.file-tree__payload`, `.evidence-frame`, and
`.split-evidence`. Payload-owned tree entries use brand blue while unchanged
Next.js entries stay ink-colored. The code shell retains its documented size.

- [ ] **Step 2: Add diagram, stats, and quiz layouts**

Add `.framework-map`, `.stat-grid`, `.quiz-question`, `.quiz-answer`, and
`.draft-badge`. Draft slides use the normal Grid palette and a subtle monospace
`MINI DRAFT` marker—never a different theme.

- [ ] **Step 3: Add reduced-motion behavior**

Use `@media (prefers-reduced-motion: reduce)` to reduce animation duration while
leaving all information visible.

- [ ] **Step 4: Build and check formatting**

```bash
npm run check
git diff --check
```

Expected: validation and build pass with no whitespace errors.

- [ ] **Step 5: Commit the completed visual system**

```bash
git add src/styles.css DESIGN_SYSTEM.md
git commit -m "feat: style Payload WarsawJS talk"
```

---

### Task 7: Visual QA, notes QA, and final draft verification

**Files:**
- Modify: `src/slides/content.js` for clipping or copy corrections only
- Modify: `src/styles.css` for layout corrections only

**Interfaces:**
- Consumes: complete deck and all evidence assets
- Produces: verified presentation draft ready for content refinement

- [ ] **Step 1: Serve the deck and inspect every horizontal slide**

Run `npm run dev`, open the attached collaborative preview or supported browser,
and inspect slides 1–21 at a 16:9 viewport. Confirm titles, code, screenshots,
and draft labels remain inside the safe area.

- [ ] **Step 2: Inspect every Auto-Animate sequence**

Navigate forward and backward through tree/code stacks. Confirm only lines or
tree entries move and `.grid-window` keeps the same bounding box.

- [ ] **Step 3: Inspect speaker notes**

Open Reveal speaker view and verify every slide has Polish notes that add context
instead of repeating visible text. Confirm the estimated delivery fits 20 minutes.

- [ ] **Step 4: Verify the final draft**

```bash
npm run check
git diff --check
git status --short
```

Expected: validator and build pass; remaining modifications are only intentional
presentation, fixture, screenshot, and documentation files.

- [ ] **Step 5: Commit QA corrections**

```bash
git add src public/screenshots package.json DESIGN_SYSTEM.md
git commit -m "fix: polish Payload talk draft"
```
