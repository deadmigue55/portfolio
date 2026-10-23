"""Draws public/og-image.png (the preview shown when the site is shared), 1200 x 630, from the real data.

The three curves and the three numbers are read from src/data/mortality.js (which scripts/export-mortality-data.py
writes from the Mortality Table Builder), so the image cannot disagree with the site. Fonts are the site's own,
from node_modules. Run after `npm ci`:

    uv run --no-project --with playwright python -I scripts/make-og-image.py
"""
import json
import math
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "node_modules"
OUT = ROOT / "public" / "og-image.png"

text = (ROOT / "src" / "data" / "mortality.js").read_text(encoding="utf-8")
data = json.loads(text.split("export default ", 1)[1])
impact = data["impact"]
qx = data["qx"]

# Plot box in a 520 x 340 drawing, vertical axis logarithmic, ages 20 to 100
AGES = list(range(20, 101))
X0, X1, Y0, Y1 = 8, 512, 18, 322
LO, HI = math.log10(1.5e-4), math.log10(0.5)


def px(age):
    return X0 + (age - 20) / 80 * (X1 - X0)


def py(q):
    return Y1 - (math.log10(q) - LO) / (HI - LO) * (Y1 - Y0)


def path(values):
    return " ".join(f"{'M' if i == 0 else 'L'}{px(a):.1f},{py(values[a]):.1f}" for i, a in enumerate(AGES))


gap_ratio = round(100 * qx["IM"][40] / qx["M"][40])
stats = [
    (f"{round(impact['data']['deaths'] / 1000)}k", "insured deaths behind the table"),
    (f"{impact['price']['m40']}%", "cheaper term, man of 40, same 10% return"),
    (f"{gap_ratio}%", "of the population's death rate, man of 40"),
]


def font(family_dir, file, name, weight, style="normal"):
    url = (FONTS / family_dir / "files" / file).as_uri()
    return f"@font-face{{font-family:'{name}';src:url('{url}') format('woff2');font-weight:{weight};font-style:{style};}}"


css_fonts = "".join(
    [
        font("@fontsource-variable/bricolage-grotesque", "bricolage-grotesque-latin-wght-normal.woff2", "Bricolage", "200 800"),
        font("@fontsource/instrument-serif", "instrument-serif-latin-400-italic.woff2", "Instrument", "400", "italic"),
        font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff2", "Plex Mono", "400"),
        font("@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2", "Plex Mono", "500"),
        font("@fontsource/ibm-plex-sans", "ibm-plex-sans-latin-400-normal.woff2", "Plex Sans", "400"),
    ]
)

grid = "".join(
    f'<line x1="{X0}" x2="{X1}" y1="{py(q):.1f}" y2="{py(q):.1f}" stroke="#ffffff" stroke-opacity="0.09"/>'
    for q in (1e-3, 1e-2, 1e-1)
)
stat_html = "".join(f'<div class="stat"><b>{v}</b><span>{label}</span></div>' for v, label in stats)

html = f"""<!doctype html><meta charset="utf-8"><style>
{css_fonts}
*{{box-sizing:border-box;margin:0}}
body{{width:1200px;height:630px;background:radial-gradient(900px 500px at 78% 40%,#2a2430 0%,#07162B 62%);color:#f6ede4;
font-family:'Plex Sans',sans-serif;position:relative;overflow:hidden}}
.eyebrow{{position:absolute;left:72px;top:64px;font:500 15px 'Plex Mono';letter-spacing:.16em;color:#FF8A3D}}
.name{{position:absolute;left:72px;top:104px;font:700 92px/0.95 'Bricolage';letter-spacing:-.03em}}
.name i{{display:block;font:italic 400 100px/0.9 'Instrument';color:#FF8A3D;letter-spacing:0}}
.lead{{position:absolute;left:72px;top:312px;width:530px;font-size:23px;line-height:1.36;color:#d9d2cb}}
.stats{{position:absolute;left:72px;top:474px;display:flex;gap:28px}}
.stat{{width:170px;border-top:1px solid rgba(255,255,255,.28);padding-top:10px}}
.stat b{{display:block;font:500 40px 'Plex Mono';color:#fff}}
.stat span{{display:block;margin-top:2px;font:400 13px/1.3 'Plex Mono';color:#b9b3ad}}
.url{{position:absolute;left:72px;top:582px;font:400 18px 'Plex Mono';color:#9a948e}}
.foot{{position:absolute;right:72px;top:582px;font:400 16px 'Plex Mono';color:#9a948e}}
svg{{position:absolute;left:618px;top:140px}}
.legend{{position:absolute;left:622px;top:496px;display:flex;gap:20px;font:400 13.5px 'Plex Mono'}}
.legend i{{display:inline-block;width:22px;margin-right:8px;vertical-align:middle;height:2px;border-radius:2px}}
.cap{{position:absolute;left:622px;top:150px;font:400 13.5px 'Plex Mono';color:#9a948e;letter-spacing:.04em}}
</style>
<div class="eyebrow">ACTUARY · PRICING &amp; RISK · DATA &amp; AI</div>
<div class="name">Miguel<i>Vilchis</i></div>
<div class="lead">I built a pricing table for Mexican life insurance from 20&nbsp;million insured lives, and showed a term policy can cost 20% to 57% less and still earn its target return.</div>
<div class="stats">{stat_html}</div>
<div class="url">deadmigue.vercel.app</div>
<div class="foot">Live dashboard · report · Excel workbook</div>
<div class="cap">qₓ · probability of dying by age, Mexican men</div>
<svg width="520" height="340" viewBox="0 0 520 340">
{grid}
<path d="{path(qx['CNSF'])}" fill="none" stroke="#9a948e" stroke-width="2.4" stroke-dasharray="6 6" stroke-linecap="round"/>
<path d="{path(qx['M'])}" fill="none" stroke="#d9d2cb" stroke-width="2.2" stroke-linecap="round"/>
<path d="{path(qx['IM'])}" fill="none" stroke="#FF8A3D" stroke-opacity=".2" stroke-width="12" stroke-linecap="round"/>
<path d="{path(qx['IM'])}" fill="none" stroke="#FF8A3D" stroke-width="4.2" stroke-linecap="round"/>
<line x1="{px(40):.1f}" x2="{px(40):.1f}" y1="{py(qx['M'][40]) + 4:.1f}" y2="{py(qx['IM'][40]) - 4:.1f}" stroke="#fff" stroke-width="1.4" stroke-dasharray="2 3"/>
<circle cx="{px(40):.1f}" cy="{py(qx['IM'][40]):.1f}" r="5" fill="#FF8A3D"/>
<circle cx="{px(40):.1f}" cy="{py(qx['M'][40]):.1f}" r="5" fill="#07162B" stroke="#d9d2cb" stroke-width="2"/>
<rect x="{px(40) + 12:.1f}" y="{(py(qx['M'][40]) + py(qx['IM'][40])) / 2 - 15:.1f}" width="64" height="30" rx="15" fill="#07162B" stroke="#FF8A3D" stroke-width="1.6"/>
<text x="{px(40) + 44:.1f}" y="{(py(qx['M'][40]) + py(qx['IM'][40])) / 2 + 6:.1f}" text-anchor="middle" font-family="Plex Mono" font-size="17" font-weight="500" fill="#fff">{gap_ratio}%</text>
</svg>
<div class="legend">
<span style="color:#FF8A3D"><i style="background:#FF8A3D;height:4px"></i>Insured men, 2023–25</span>
<span style="color:#d9d2cb"><i style="background:#d9d2cb"></i>Whole population</span>
<span style="color:#9a948e"><i style="border-top:2px dashed #9a948e;height:0"></i>CNSF 2013</span>
</div>
"""

with tempfile.TemporaryDirectory() as tmp:
    page_file = Path(tmp) / "og.html"
    page_file.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})
        page.goto(page_file.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT))
        browser.close()
print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
