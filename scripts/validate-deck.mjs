import assert from 'node:assert/strict'

import { slides } from '../src/slides/content.js'

assert.equal(slides.length, 21, 'the deck must contain 21 logical slides')
assert.deepEqual(
  slides.map(({ id }) => id),
  Array.from({ length: 21 }, (_, index) => index + 1),
  'slide IDs must be sequential',
)
assert.ok(slides.every(({ title, note }) => title.trim() && note.trim()), 'every slide needs a title and note')
assert.deepEqual(
  slides.filter(({ draft }) => draft).map(({ id }) => id),
  [18, 20, 21],
  'only slides 18, 20, and 21 may be mini drafts',
)

for (const id of [5, 8, 10, 11, 13, 14, 15]) {
  const slide = slides.find((candidate) => candidate.id === id)
  assert.ok(slide?.image, `slide ${id} must link to screenshot evidence`)
}

console.log('Deck structure valid: 21 slides, notes, drafts, and evidence links verified.')
