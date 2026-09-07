# PayloadCMS WarsawJS Talk — Design Specification

## Goal

Create a 25-minute Reveal.js talk for a WarsawJS developer audience. The talk
must demonstrate how Payload is used in a real Next.js application and prove
the central thesis:

> Payload does not merely provide content to an application. It becomes part
> of the application.

The deck should position Payload as a code-first CMS framework rather than a
traditional remote headless CMS. Five minutes are reserved for a quiz. Q&A is
outside the 25-minute limit.

## Narrative frame

The title asks why Figma bought Payload. That question remains open throughout
the talk; it is not answered in a separate introductory section. Each technical
demonstration contributes part of the answer. The conclusion returns to the
question after the audience has seen the evidence.

One WarsawJS conference website is used as the continuous example. Avoid
unrelated snippets. The same application grows from a plain Next.js project
into a full content platform.

## Content and writing rules

- Visible slide copy is short: one assertion, phrase, or code example.
- The explanation belongs in Reveal speaker notes using `<aside class="notes">`.
- Visible copy remains in English; speaker notes are written in natural Polish.
- Notes should contain the real spoken narrative, transitions, and cautions.
- Each code change must be followed by visible evidence of its product effect.
- Code slides should stay below 15 visible lines and use progressive animation.
- Do not claim that code-first automatically guarantees good AI output. Explain
  that typed, versioned configuration makes the system legible and editable to
  agents.
- Payload 4.0 material must be described as an early look / work in progress,
  not as a stable release.

## Timing

| Time | Segment |
|---:|---|
| 0:00–1:00 | Title and opening question |
| 1:00–4:00 | Plain Next.js project becomes a Payload project |
| 4:00–15:00 | Build the WarsawJS conference application |
| 15:00–17:00 | Code-first becomes AI-native |
| 17:00–19:00 | Payload 4.0 early look and conclusion |
| 19:00–20:00 | Speaker credibility slide |
| 20:00–25:00 | Quiz draft |
| after talk | Q&A |

## Slide sequence

### 01 — Title

Keep the approved title slide and official Payload logo. The title creates the
question that drives the whole talk.

Visible content:

- `PayloadCMS: Why Figma bought it`
- `Kacper Zawojski`
- existing short subtitle

### 02 — A normal Next.js app

Assertion: `It starts as a Next.js app.`

Show a compact, accurate root tree for a minimal App Router project. The tree
is the evidence, not decoration.

### 03 — Payload moves into the same app

Assertion: `Payload lives here.`

Use Reveal Auto-Animate to retain the Next.js tree and add Payload-owned files
in blue:

- `src/app/(payload)/admin/[[...segments]]/page.tsx`
- `src/app/(payload)/api/[...slug]/route.ts`
- `src/collections/`
- `src/payload.config.ts`
- generated `src/payload-types.ts`

The point is one repository, runtime, language, and deployment—not two systems
connected by an HTTP boundary.

### 04 — One collection defines the model

Assertion: `The backend starts with a config.`

Introduce an `Events` collection with only `title` and `date`. Use the existing
stable code-window animation pattern.

### 05 — Code becomes an admin UI

Assertion: `Add fields. Get a product.`

Show a real screenshot of the Payload event editor generated from the previous
collection. Highlight the title and date fields. This establishes the recurring
code → outcome rhythm.

### 06 — The schema generates types

Assertion: `The schema is executable.`

Show `payload generate:types`, then a small excerpt of the generated `Event`
type. Avoid a large generated file dump.

### 07 — Payload is local to Server Components

Assertion: `No HTTP request required.`

Show a Next.js Server Component using `getPayload()` and `payload.find()` to
load events. Call it the Local API in notes; avoid loosely calling every Payload
API an SDK.

### 08 — The frontend receives real data

Assertion: `The CMS and frontend ship together.`

Show the resulting WarsawJS event listing in the local Next.js frontend. This
is the product effect of slides 06–07.

### 09 — Hooks add lifecycle behavior

Assertion: `Content has a lifecycle.`

Add a small `beforeChange` collection hook that derives the event slug from its
title. Keep the behavior obvious in fewer than 12 lines.

### 10 — The hook changes the document

Assertion: `Behavior is visible.`

Show the updated event in Admin with the derived value. The screenshot must use
data created by the demonstration project.

### 11 — Authentication is a collection

Assertion: `Auth is part of the model.`

Show a `Users` collection with `auth: true` and a minimal `role` field. Place a
real login/Admin screenshot next to the compact code example on the same slide.

### 12 — Authorization is a function

Assertion: `Access is code.`

Show a typed access function that allows administrators to manage events and
returns a query constraint for another role. Notes must mention that Local API
operations use `overrideAccess: false` when acting on behalf of a user.

### 13 — Permissions change the interface

Assertion: `One rule. Every surface.`

Show the visible result for a restricted user in Admin. In notes, connect the
same rule to REST, GraphQL, and properly configured Local API calls.

### 14 — Custom endpoints extend the application

Assertion: `The API is still yours.`

Add a concise authenticated `/check-in` endpoint for the conference. Show its
real JSON response next to the code. Avoid implementing an unrelated CRUD
endpoint already generated by Payload.

### 15 — The Admin panel is React

Assertion: `The Admin is not a black box.`

Add an event status badge as a small React customization useful to conference
editors. Show the component code and its real Admin UI screenshot.

### 16 — This is a framework

Assertion: `Schema → database, API, Admin, types, auth.`

Use a compact relationship diagram to summarize what the growing config has
produced. This is a synthesis slide, not a feature checklist.

### 17 — Code-first is AI-native

Assertion: `Agents can work with what they can read.`

Show that the schema, hooks, access rules, endpoints, UI components, migrations,
and types are repository context. Contrast this with configuration trapped only
inside a vendor UI. Speaker notes should explain that version control, TypeScript,
and local feedback loops make agent changes reviewable.

### 18 — Payload 4.0 early look

Status: intentionally a mini draft.

Visible content should remain a small set of labels around screenshot slots:

- redesigned Admin UI;
- core hierarchies and stronger DAM;
- simpler MCP and Payload skills;
- framework adapters and early TanStack support.

Reserve one large screenshot area and one small secondary crop. Use official
Payload images later. Label the slide `EARLY LOOK / WORK IN PROGRESS`.

### 19 — Why Figma bought it

Assertion: `Payload turns content infrastructure into product code.`

Return to the opening question. The answer should be presented as the talk's
reasoned conclusion, not as an unsupported statement about Figma's private
acquisition rationale.

### 20 — I help build it

Status: intentionally a mini draft.

Visible content:

- `Payload contributor`
- `3 years in the ecosystem`
- `X pull requests opened`
- `X issues solved — GitHub + Discord`

The speaker will fill in final numbers. Use four large statistic cells and keep
the notes focused on credibility rather than biography.

### 21 — Quiz

Status: intentionally a mini draft.

Reserve five minutes. Use three short questions with progressive answer reveals.
Draft topics:

1. Which boundary disappears when Payload is installed in Next.js?
2. Where is access control enforced?
3. Why does code-first improve agent workflows?

Do not finalize wording or answers until the teaching slides are stable.

## Demonstration project

Create a separate local fixture under `demo/payload-warsawjs/` from the official
blank template using the current supported CLI:

```bash
npx create-payload-app@latest -t blank
```

Use pnpm and select SQLite for a zero-service local demonstration. Do not embed
credentials or production data. The fixture exists to:

- confirm code examples compile against a real Payload version;
- generate authentic Admin and frontend screenshots;
- keep screenshot data consistent across the story;
- provide a source of truth for file-tree slides.

The presentation remains independent of the fixture at runtime. Screenshots are
exported to `public/screenshots/` with descriptive names.

## Screenshot plan

Capture at minimum:

1. generated Event editor with title/date fields;
2. WarsawJS event listing in the Next.js frontend;
3. event document after hook-derived data appears;
4. Admin login or authenticated area;
5. restricted user view demonstrating access control;
6. custom endpoint result;
7. custom React Admin component;
8. Payload 4.0 official preview image added later.

Crop screenshots to the relevant evidence. Never place a full browser screenshot
at an unreadable scale. Use stable sample content and hide secrets/local paths.

## Reveal.js implementation

- Preserve the Grid design system in `DESIGN_SYSTEM.md`.
- Keep the title slide as slide 01.
- Use horizontal slides for narrative progression.
- Use vertical Auto-Animate stacks only for progressive code when it does not
  confuse navigation.
- Keep `.grid-window` geometry fixed; animate code lines, not the shell.
- Use short assertion/evidence layouts instead of bullet-heavy slides.
- Add speaker notes to every completed slide.
- Draft slides must be clearly marked in markup with comments and visible draft
  placeholders where content is intentionally missing.

## Source accuracy

Payload 4.0 claims are based on official Payload sources available on
2026-09-06:

- Payload blog: `An early look at 4.0: Admin UI Redesign, TanStack, MCP, and More`
- Payload documentation: current installation guide and blank template command
- Payload GitHub repository for current template structure where necessary

Recheck the 4.0 slide immediately before the event because roadmap details may
change. Use careful wording such as `planned`, `in development`, and `early`.

## Validation

- Run the fixture's typecheck/build after each demonstrated capability.
- Run `npm run build` for the Reveal deck.
- Verify every slide at 1920×1080 and at a 16:9 browser viewport.
- Confirm all Auto-Animate sequences keep the code shell stable.
- Confirm speaker notes are available in Reveal speaker view.
- Run `git diff --check` before completion.

## Deferred items

- Final quiz wording and answer reveals.
- Final speaker statistics.
- Final Payload 4.0 screenshots.
- Any personal headshot, social links, or QR code.
