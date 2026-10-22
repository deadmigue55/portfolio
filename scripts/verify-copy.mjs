// Checks that the English and Spanish copy have exactly the same structure: same keys, same list lengths,
// same kinds of values (text or function), and no empty text. A missing translation fails here instead of on the site.
// Also checks that a **bold** marker is never left open. Run: node scripts/verify-copy.mjs
import en from '../src/i18n/en.js'
import es from '../src/i18n/es.js'

const problems = []
const kind = v => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v)

function walk(a, b, path) {
  if (kind(a) !== kind(b)) { problems.push(`${path}: ${kind(a)} in en, ${kind(b)} in es`); return }
  if (kind(a) === 'array') {
    if (a.length !== b.length) problems.push(`${path}: ${a.length} items in en, ${b.length} in es`)
    a.forEach((x, i) => b[i] !== undefined && walk(x, b[i], `${path}[${i}]`))
  } else if (kind(a) === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) problems.push(`${path}.${k}: only in es`)
      else if (!(k in b)) problems.push(`${path}.${k}: only in en`)
      else walk(a[k], b[k], `${path}.${k}`)
    }
  } else if (kind(a) === 'string') {
    if (!a.trim() || !b.trim()) problems.push(`${path}: empty text`)
    if ((a.match(/\*\*/g) || []).length % 2 || (b.match(/\*\*/g) || []).length % 2) problems.push(`${path}: unbalanced ** marker`)
  }
}

walk(en, es, 'copy')
if (problems.length) {
  console.error(problems.join('\n'))
  process.exit(1)
}
console.log('Copy check passed: English and Spanish have the same structure')
