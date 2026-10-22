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
const cnsf = data.checks.CNSF
check('CNSF 20-year term premium at 40', termPremium(data.qx.CNSF, 40, 20, data.interest), cnsf.termPremium20['40'], cnsf.termPremium20['40'] * 2e-4)
check('CNSF life expectancy at 65', lifeExpectancy(data.qx.CNSF, 65), cnsf.e65, 0.05)

if (failed) {
  console.error(`${failed} check(s) failed`)
  process.exit(1)
}
console.log('All checks passed')
