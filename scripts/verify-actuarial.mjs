// Checks the explorer's JavaScript maths against results computed by the Python project
// (Mortality Table Builder). Run: node scripts/verify-actuarial.mjs
import data from '../src/data/mortality.js'
import { lifeExpectancy, termPremium } from '../src/lib/actuarial.js'

let failed = 0
const check = (label, got, want, tol) => {
  const ok = Math.abs(got - want) <= tol
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: js ${got.toFixed(6)}  python ${want.toFixed(6)}`)
}

for (const sex of ['M', 'F']) {
  const ref = data.checks[sex]
  for (const [age, want] of Object.entries(ref.termPremium20)) {
    // The data file stores qx to 6 significant digits, so allow a hair of rounding
    check(`${sex} 20-year term premium at ${age}`, termPremium(data.qx[sex], +age, 20, data.interest), want, want * 2e-4)
  }
  check(`${sex} life expectancy at birth`, lifeExpectancy(data.qx[sex], 0), ref.e0, 0.02)
  check(`${sex} life expectancy at 65`, lifeExpectancy(data.qx[sex], 65), ref.e65, 0.02)
}
// Version 2: the insured-lives table (traditional term), against the project's premium table
for (const sex of ['M', 'F']) {
  for (const [age, want] of Object.entries(data.checks['I' + sex].termPremium20)) {
    check(`insured ${sex} 20-year term premium at ${age}`, termPremium(data.qx['I' + sex], +age, 20, data.interest), want, want * 2e-4)
  }
}
const cnsf = data.checks.CNSF
check('CNSF 20-year term premium at 40', termPremium(data.qx.CNSF, 40, 20, data.interest), cnsf.termPremium20['40'], cnsf.termPremium20['40'] * 2e-4)
check('CNSF life expectancy at 65', lifeExpectancy(data.qx.CNSF, 65), cnsf.e65, 0.05)

// The business-impact numbers: the book-size figures follow from the insured death rate at 40 (binomial, equal policies)
const { book, margin, market, price } = data.impact
const q40 = data.qx.IM[40]
check('impact: insured q40 is the one the book figures use', q40, book.q40, book.q40 * 1e-5)
for (const [n, cv] of Object.entries(book.cv)) {
  check(`impact: claims volatility at ${n} policies (%)`, 100 * Math.sqrt((1 - q40) / (n * q40)), cv, 0.06)
}
check('impact: policies at which one standard deviation fits the margin', (1 - q40) / (q40 * margin ** 2), book.policiesFor15, 600)
check('impact: market claims share of premium (%)', (100 * market.claimedBn) / market.premiumBn, market.claimsShare, 0.6)
check('impact: the saving is the gross premium gap (%)', 100 * (1 - price.grossM40 / price.grossCnsfM40), price.m40, 0.6)

if (failed) {
  console.error(`${failed} check(s) failed`)
  process.exit(1)
}
console.log('All checks passed')
