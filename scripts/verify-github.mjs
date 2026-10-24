// The contact card's live graph: days are grouped into Sunday-first weeks and padded with null at the ends.
import assert from 'node:assert/strict'
import { toWeeks, formatAgo, WEEKS } from '../src/lib/githubLive.js'

// 2026-10-21 is a Wednesday, 2026-10-24 a Saturday, 2026-10-25 a Sunday
const days = ['2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24', '2026-10-25', '2026-10-26']
  .map((date, i) => ({ date, level: i % 5 }))
const cols = toWeeks(days)
assert.equal(cols.length, 2)
assert.deepEqual(cols[0], [null, null, null, 0, 1, 2, 3])
assert.deepEqual(cols[1], [4, 0, null, null, null, null, null]) // Sunday 25th and Monday 26th, rest not yet
assert.equal(toWeeks(days, 1).length, 1)
assert.equal(WEEKS, 20)

const ago = h => formatAgo(new Date(Date.now() - h * 3600e3).toISOString(), 'en')
assert.equal(ago(3), '3 hours ago')
assert.equal(ago(48), '2 days ago')
console.log('ok   github live: weeks and relative time')
