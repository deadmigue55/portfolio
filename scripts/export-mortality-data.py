"""Exports the real numbers behind the portfolio's "Try the table" explorer.

Reads the demo bundle of the Mortality Table Builder (a SQLite file shipped in that repository)
and writes src/data/mortality.js: one-year death probabilities (qx) for ages 0 to 110, Mexican
men and women in 2023 (graduated INEGI + CONAPO), the regulator's CNSF M 2013 base table and the
insured-lives table of version 2 (CNSF individual life statistics, traditional term cover).
It also writes reference values (life expectancy, 20-year term premium) so that the JavaScript
actuarial maths in src/lib/actuarial.js can be checked against the Python project:
run `node scripts/verify-actuarial.mjs`.

Usage:  python scripts/export-mortality-data.py [path/to/demo.sqlite]
"""
import json
import sqlite3
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
DEFAULT_DB = HERE.parent.parent / "Mortality-Table-Builder" / "app" / "data" / "demo.sqlite"
OUT = HERE.parent / "src" / "data" / "mortality.js"
YEAR = 2023
INTEREST = 0.04


def round6(values):
    return [float(f"{v:.6g}") for v in values]


def pct(x, digits=0):
    value = round(100 * float(x), digits)
    return int(value) if digits == 0 else value


def impact(con, q_men):
    """The business case of version 2, every number read from the project's tables.

    Price: a 20-year term priced on the insured table (with its margin) against the same product
    priced on CNSF 2013, both at the 10% target return. Return: what the policy earns if mortality
    is as measured. Market: what the market wrote and reported on traditional term cover. Book:
    how the claims of a book of equal policies settle down as it grows (binomial, one year).
    """
    prem = con.execute(
        "select sex, issue_age, saving_vs_cnsf, irr_best_estimate, gross_premium_per_1000, "
        "gross_premium_cnsf_per_1000 from pricing_insured where term = 20"
    ).fetchall()
    by = {(r[0], r[1]): r for r in prem}
    saving = {s: [r[2] for r in prem if r[0] == s] for s in ("M", "F")}
    irr = [r[3] for r in prem]
    margin = con.execute("select recommended_margin from insured_margin limit 1").fetchone()[0]

    m = con.execute(
        "select sum(lives), sum(sum_assured), sum(premium), sum(deaths), sum(claimed), sum(paid) "
        "from insured_market where segment='term_traditional' and year between 2023 and 2025"
    ).fetchone()
    lives, sum_assured, premium, deaths, claimed, paid = m

    pooled = con.execute(
        "select sum(deaths), sum(exposure) from insured_pooled where segment='all'"
    ).fetchone()
    ratio = con.execute(
        "select min(ratio_population), max(ratio_population) from insured_table "
        "where segment='all' and age between 25 and 65"
    ).fetchone()
    stress = dict(
        con.execute(
            "select kind, extra_pct from stress_pandemic_book "
            "where scenario in ('2021 as insured lives lived it', 'CNSF 99.5th percentile table')"
        ).fetchall()
    )

    q40 = q_men[40]
    cv = lambda n: ((1 - q40) / (n * q40)) ** 0.5  # noqa: E731
    return {
        "target": 0.10,
        "margin": round(float(margin), 4),
        "price": {
            "m40": pct(by[("M", 40)][2]),
            "f40": pct(by[("F", 40)][2]),
            "menRange": [pct(min(saving["M"])), pct(max(saving["M"]))],
            "womenRange": [pct(min(saving["F"])), pct(max(saving["F"]))],
            "range": [pct(min(min(v) for v in saving.values())), pct(max(max(v) for v in saving.values()))],
            "grossM40": round(by[("M", 40)][4], 2),
            "grossCnsfM40": round(by[("M", 40)][5], 2),
        },
        "returnAtMeasured": [pct(min(irr)), pct(max(irr))],
        "market": {
            "years": "2023-2025",
            "premiumBn": round(premium / 1e9, 1),
            "claimedBn": round(claimed / 1e9, 1),
            "claimsShare": pct(claimed / premium),
            "paidShare": pct(paid / premium),
            "deaths": int(deaths),
            "premiumPer1000": round(1000 * premium / sum_assured, 2),
            "avgSumAssuredK": round(sum_assured / lives / 1000),
        },
        "book": {
            "q40": float(f"{q40:.6g}"),
            "cv": {str(n): pct(cv(n), 1) for n in (10_000, 100_000, 1_000_000)},
            "policiesFor15": int(round((1 - q40) / (q40 * margin**2), -3)),
        },
        "pandemic": {"insuredLived": pct(stress["observed"]), "regulator": pct(stress["regulatory"])},
        "data": {
            "deaths": int(pooled[0]),
            "livesPerYear": round(pooled[1] / 3 / 1e6, 1),
            "ofPopulation": [pct(ratio[0]), pct(ratio[1])],
        },
    }


def main():
    db = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_DB
    con = sqlite3.connect(db)

    def life(sex, col):
        rows = con.execute(
            f"select age, {col} from life_tables where year=? and sex=? order by age", (YEAR, sex)
        ).fetchall()
        assert [r[0] for r in rows] == list(range(111)), f"unexpected ages for {sex}"
        return [r[1] for r in rows]

    cnsf = con.execute(
        "select age, qx from cnsf_rates where \"table\"='CNSF M 2013' and variant='base' order by age"
    ).fetchall()
    assert [r[0] for r in cnsf] == list(range(111))

    checks = {}
    for sex in ("M", "F"):
        row = {
            r[0]: r[1]
            for r in con.execute(
                "select age, P_term_20 from actuarial_values where year=? and sex=? and interest=? and age in (25,30,40,50,60)",
                (YEAR, sex, INTEREST),
            )
        }
        checks[sex] = {"termPremium20": {str(k): float(f"{v:.8g}") for k, v in row.items()}}
        summ = con.execute(
            "select e0, e65 from life_summary where year=? and sex=?", (YEAR, sex)
        ).fetchone()
        checks[sex]["e0"] = float(f"{summ[0]:.6g}")
        checks[sex]["e65"] = float(f"{summ[1]:.6g}")

    ref = con.execute(
        "select e65, P_term_20_at_40 from life_table_comparison "
        "where \"table\"='CNSF M 2013 (non-disabled lives, base)' and interest=?",
        (INTEREST,),
    ).fetchone()
    checks["CNSF"] = {"e65": float(f"{ref[0]:.6g}"), "termPremium20": {"40": float(f"{ref[1]:.8g}")}}

    # Version 2: the table a quote is priced on, from CNSF individual life statistics
    # (traditional term cover, the pricing basis of the project)
    insured = {}
    for sex in ("M", "F"):
        rows = con.execute(
            "select age, qx from insured_table where segment='term_traditional' and sex=? order by age",
            (sex,),
        ).fetchall()
        assert [r[0] for r in rows] == list(range(111)), f"unexpected insured ages for {sex}"
        insured[sex] = [r[1] for r in rows]
        prem = {
            r[0]: r[1] / 1000
            for r in con.execute(
                "select issue_age, premium_per_1000 from insured_premiums "
                "where \"table\"='Mexico insured: Term, traditional' and sex=? and term=20 "
                "and issue_age in (25,30,40,50,60)",
                (sex,),
            )
        }
        assert len(prem) == 5, f"missing insured premiums for {sex}"
        checks["I" + sex] = {"termPremium20": {str(k): float(f"{v:.8g}") for k, v in prem.items()}}

    data = {
        "year": YEAR,
        "interest": INTEREST,
        "impact": impact(con, insured["M"]),
        "source": "INEGI deaths and CONAPO population, graduated; CNSF M 2013 base table; "
        "CNSF individual life statistics 2023-2025 (insured, traditional term)",
        "qx": {
            "M": round6(life("M", "qx")),
            "F": round6(life("F", "qx")),
            "CNSF": round6([r[1] for r in cnsf]),
            "IM": round6(insured["M"]),
            "IF": round6(insured["F"]),
        },
        "checks": checks,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// Generated by scripts/export-mortality-data.py from the Mortality Table Builder demo bundle.\n"
        "// Real results of the project. Do not edit by hand.\n"
        f"export default {json.dumps(data, separators=(',', ':'))}\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
