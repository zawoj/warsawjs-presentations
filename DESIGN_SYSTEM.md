# Payload CMS Presentation Design System

This document is the visual source of truth for the presentation. New slides
must extend this system instead of introducing a second theme.

## Design direction

The deck uses the **Grid** direction: precise, technical, calm, and editorial.
It should feel appropriate for a developer conference while staying close to
Payload's minimal, code-first identity.

Core characteristics:

- pale blue-gray canvas;
- subtle architectural grid;
- black typography with one electric-blue accent;
- strong scale contrast between headlines and metadata;
- restrained decoration;
- code presented as a stable product component, not a terminal gimmick.

## Reveal.js contract

Use the following configuration for the entire deck:

```js
Reveal.initialize({
  hash: true,
  center: true,
  transition: 'fade',
  transitionSpeed: 'fast',
  backgroundTransition: 'fade',
  width: 1920,
  height: 1080,
  margin: 0.08,
  minScale: 0.2,
  maxScale: 2,
})
```

Every standard slide uses `data-background-color="#e9edef"`. Do not set an
opaque background directly on a `<section>` because that blocks Reveal.js
slide backgrounds.

## Design tokens

### Colors

| Token | Value | Usage |
|---|---:|---|
| Canvas | `#e9edef` | Slide background |
| Ink | `#11161a` | Headlines and primary text |
| Ink secondary | `#354149` | Body copy |
| Metadata | `#4e5a62` | Labels and slide metadata |
| Muted | `#66747d` | Secondary names and captions |
| Brand blue | `#174ee8` | Primary accent and highlighted words |
| Bright blue | `#2962ff` | Rules, markers, and code-window edge |
| Code blue | `#7fa0ff` | Keywords inside code |
| Code green | `#8bddb2` | Strings inside code |
| Code canvas | `#11161a` | Code component background |
| Code chrome | `#171d21` | Code component header |

Blue is the only general-purpose accent. Figma's logo colors may appear only
inside the Figma mark.

### Typography

- Display and body: `Inter`.
- Code and metadata: `DM Mono`.
- Fallbacks: Arial for sans-serif; SFMono/Consolas for monospace.
- Standard headline: `112px`, weight `800`, line-height `.91`, tracking
  `-.075em`.
- Title-slide headline: `126px`.
- Body lead: `29–30px`, weight `500`, line-height approximately `1.4`.
- Metadata: `13–20px`, monospace, medium weight.
- Headings use sentence/title case. Metadata may use uppercase.

Avoid gradients, drop-shadowed text, outlined headlines, and decorative font
families.

### Spatial system

- Presentation canvas: `1920 × 1080`.
- Standard section padding: `76px 84px 68px`.
- Standard two-column gap: `104px`.
- Title two-column gap: `110px`.
- Main content should stay inside the visible blueprint grid.
- Use generous negative space; do not fill every grid cell.

## Background grid

Every designed slide includes `.blueprint-grid` as its first decorative
element. It uses two one-pixel linear gradients at an `80px × 80px` interval
with low opacity. The grid is structural texture, never foreground content.

Coordinates such as `WARSAW / 2026` or `52°13′N / 21°00′E` may be used as
small monospace details. Use at most one coordinate label per slide.

## Slide patterns

### Title slide

Use `.title-layout` with a wider text column and a narrower visual column.

- Speaker identification sits above the title.
- The title is the largest element on the slide.
- Highlight at most one meaningful word in blue.
- Supporting text stays under roughly 30 words when possible.
- The visual should explain the premise, not decorate it.

The current title visual uses an official Payload wordmark and a compact Figma
mark connected by a thin blue arrow.

### Standard content slide

Use `.slide-grid` with:

1. metadata, assertion, and short context in the left column;
2. evidence, diagram, screenshot, or code in the right column.

Prefer assertion-evidence slides over bullet lists. Each slide should make one
claim that can be restated in one sentence.

Implemented evidence patterns:

- `.assertion-layout` pairs a short claim with a stable project tree.
- `.evidence-layout` pairs a claim with one large product screenshot.
- `.split-layout` pairs compact code with its real UI or API result.
- `.diagram-layout` visualizes one source feeding several framework surfaces.
- `.ai-layout`, `.future-layout`, `.stats-layout`, and `.quiz-layout` retain the
  same Grid canvas and spacing rather than introducing section-specific themes.

### Code component

The code component is `.grid-window` and must remain geometrically stable:

- total height: `530px`;
- code viewport height: `470px`;
- dark canvas with a `58px` header;
- one-pixel border and four-pixel blue left rule;
- line numbers enabled;
- maximum of roughly 12–15 visible lines.

For progressive code, use adjacent vertical slides with:

```html
<section data-auto-animate data-auto-animate-id="example-code">
  <pre data-id="example-code-block">
    <code data-line-numbers>...</code>
  </pre>
</section>
```

Keep the component dimensions and all surrounding content identical across
steps. Only add, remove, or change code lines. This prevents the slide from
jumping while Reveal.js animates the code.

## Motion

- Default slide transition: fast fade.
- Code additions: Reveal.js Auto-Animate, `0.7s`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`.
- Animate information hierarchy or code progression only.
- Do not use zoom, convex, 3D rotation, bouncing, or decorative looping motion.
- A stable component shell is mandatory; content may animate inside it.

## Reusable details

- `.theme-meta`: circular slide number plus short section name.
- `.kicker`: blue uppercase monospace context label.
- `.grid-pills`: short technology labels with square blue markers.
- `.interaction-hint`: small, right-aligned keyboard instruction.
- `.grid-window`: fixed code component.
- `.brand-node`: geometric entity in a relationship diagram.
- `.file-tree-panel`: dark, line-numbered project tree.
- `.evidence-frame`: bordered screenshot crop with a small caption.
- `.draft-badge`: restrained marker for intentionally unfinished slides.

Do not add a theme selector. Grid is the only approved visual direction.

## Brand assets

- Official Payload wordmark: `public/payload-logo.svg`.
- The Payload wordmark may be inverted to white on a dark surface.
- Preserve the wordmark aspect ratio and clear space.
- Do not redraw the Payload symbol or replace it with plain text.
- Do not stretch, outline, recolor with gradients, or crop the logo.

## Content rules

- Presentation language may be English, but keep terminology consistent.
- Prefer short assertions over topic labels.
- Avoid paragraphs longer than three lines on screen.
- Avoid agendas and dense bullet lists unless the content truly requires them.
- Code samples should demonstrate one idea and omit unrelated boilerplate.
- Put explanation in speaker notes rather than shrinking the visible content.

## Do and don't

| Do | Don't |
|---|---|
| Use the pale grid canvas consistently | Introduce dark or gradient slide themes |
| Use blue for one focal point | Highlight multiple phrases on one slide |
| Keep layouts aligned to the 80px grid | Center everything without a structural reason |
| Use official brand assets | Approximate logos with text or improvised shapes |
| Keep code chrome fixed during animation | Resize the code window between steps |
| Verify at 16:9 after every visual change | Assume a browser-sized layout will scale correctly |

## Implementation checklist

Before finishing any slide change:

1. Confirm the slide uses the Grid palette and typography.
2. Confirm there is one primary message.
3. Check that no content is clipped at `1920 × 1080`.
4. If code animates, compare its shell position across all steps.
5. Run `npm run build`.
6. Render or inspect the changed slide at `1440 × 900` or another 16:9 size.
7. Run `git diff --check`.

## Source files

- `src/styles.css` — implemented tokens and components.
- `src/main.js` — slide markup, Reveal.js configuration, and motion.
- `public/payload-logo.svg` — official Payload wordmark.
- `index.html` — Reveal.js document shell.

When implementation and this document disagree, treat the document as the
intended contract and update both in the same change.
