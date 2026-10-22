// Small actuarial toolkit for the "Try the table" explorer. Pure functions over a qx array
// (one-year death probabilities, index = age). Checked against the Python project by
// scripts/verify-actuarial.mjs, so the numbers shown on the page are the project's numbers.

const OMEGA = 111 // everyone still alive at the end of the table dies at this age

const q = (qx, age) => (age >= qx.length ? 1 : qx[age])

// Probability that a person aged `age` survives k more years
export function survival(qx, age, k) {
  let p = 1
  for (let t = 0; t < k && age + t < OMEGA; t++) p *= 1 - q(qx, age + t)
  return age + k >= OMEGA ? 0 : p
}

// Complete life expectancy: deaths are assumed to fall in the middle of the year on average
export function lifeExpectancy(qx, age) {
  let alive = 1
  let total = 0
  for (let t = age; t < OMEGA; t++) {
    const dead = alive * q(qx, t)
    total += alive - 0.5 * dead
    alive -= dead
  }
  return total
}

// Net annual premium per 1 of cover for an n-year term policy: death benefit paid at the end of the
// year of death, level premium paid at the start of each year while alive, interest rate i.
export function termPremium(qx, age, n, i) {
  const v = 1 / (1 + i)
  let alive = 1
  let insurance = 0
  let annuity = 0
  for (let k = 0; k < n && age + k < OMEGA; k++) {
    annuity += alive * v ** k
    insurance += alive * q(qx, age + k) * v ** (k + 1)
    alive *= 1 - q(qx, age + k)
  }
  return insurance / annuity
}

// Probability of dying before reaching `to`, for someone aged `from`
export function dieBefore(qx, from, to) {
  return 1 - survival(qx, from, to - from)
}
