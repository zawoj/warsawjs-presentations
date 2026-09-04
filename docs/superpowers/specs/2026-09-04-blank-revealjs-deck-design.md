# Blank Reveal.js Deck Design

## Context

The repository currently contains no presentation implementation. The first
iteration establishes Reveal.js as the presentation library while deliberately
avoiding any visual direction that could constrain later iterations.

The project-local `revealjs-presenter` skill is available to Codex and Claude
Code. Its themes and opinionated defaults do not apply to this iteration because
the requested starting point is a completely blank white slide.

## Goals

- Use the npm package for Reveal.js 6 with Vite as the local development and
  production-build tool.
- Render exactly one empty slide on a white canvas.
- Keep only the Reveal.js core stylesheet required for slide layout and scaling.
- Disable visible navigation controls, progress UI, slide numbers, and visual
  transitions.
- Provide repeatable development, test, and build commands.

## Non-goals

- No presentation content, speaker notes, theme, typography, branding, layout
  primitives, plugins, or decorative CSS.
- No CDN dependencies.
- No deployment setup.
- No abstraction for future slide types until an actual slide needs it.

## Architecture

The project will use a minimal static Vite entry point:

- `index.html` contains only the standard Reveal.js wrapper and one empty
  `<section>` inside `.slides`.
- `src/main.js` imports `reveal.js`, imports the package's core
  `dist/reveal.css`, and initializes a single deck instance.
- `package.json` exposes `dev`, `test`, and `build` scripts and pins the selected
  dependency versions through `package-lock.json`.

Reveal.js will be initialized without plugins and with presentation chrome and
motion disabled. The browser's white canvas and Reveal.js core layout are the
entire visual surface. There will be no theme stylesheet and no project CSS
file.

## Behavior

Opening the application produces one full presentation viewport. The current
slide has no text, media, attributes, classes, notes, or child elements. Reveal
keyboard handling may initialize normally, but there is nowhere to navigate
because the deck contains only one slide.

## Testing and verification

A focused automated test will load the presentation markup as a DOM and verify
the observable contract:

- exactly one direct slide section exists;
- that section is empty;
- no Reveal.js theme or custom stylesheet is loaded;
- no visible controls, progress indicator, or slide number are enabled in the
  deck configuration.

The test will be written and observed failing before the presentation files are
implemented. Final verification will run the tests and production build, then
inspect the rendered local presentation in the shared browser to confirm a
plain white viewport with no visible content or chrome.

## Installed skill policy

The installed `revealjs-presenter` skill remains useful for later content and
presentation-design work. For this repository, direct user requirements take
precedence over its default CDN, theme, font, transition, dimension, and layout
recommendations. Agents must not introduce those defaults unless the user asks
for them in a later iteration.
