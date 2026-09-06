# Presentation design contract

Before creating or editing presentation slides, read `DESIGN_SYSTEM.md` in
full. It is the visual source of truth for this repository.

- Use only the documented Grid visual direction.
- Reuse existing tokens and components from `src/styles.css`.
- Do not add theme selectors or alternative themes.
- Keep code-component geometry fixed across Auto-Animate steps.
- Use official assets from `public/` rather than approximating logos.
- Update `DESIGN_SYSTEM.md` whenever an approved design decision changes.
- Verify visual changes at 16:9, run `npm run build`, and run
  `git diff --check` before completion.
