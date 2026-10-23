"""End-to-end checks of the portfolio in a real browser (Chromium via Playwright).

Run the site first (npm run build && npx vite preview --port 4173), then:
    uv run --no-project --with playwright python -I scripts/qa/qa.py [http://localhost:4173] [screenshots-dir]

It checks behaviour, not just looks: no console errors, no horizontal overflow, the explorer's
numbers, the command menu, the language switch, the pause-animations switch, the lightbox, the
case study, the skills captions, light and dark themes, and an axe-core accessibility scan.
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173"
OUT = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("qa-shots")
OUT.mkdir(parents=True, exist_ok=True)
AXE = Path(__file__).resolve().parents[2] / "node_modules" / "axe-core" / "axe.min.js"

results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS " if ok else "FAIL ") + name + (f"  [{detail}]" if detail else ""))


def infinite_animations(page):
    return page.evaluate(
        """() => document.getAnimations().filter(a => {
            const t = a.effect && a.effect.getComputedTiming && a.effect.getComputedTiming();
            return t && t.iterations === Infinity && a.playState === 'running';
        }).length"""
    )


with sync_playwright() as p:
    browser = p.chromium.launch()

    # ── Desktop pass ──
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="no-preference")
    page = ctx.new_page()
    problems = []
    page.on("console", lambda m: problems.append(m.text) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: problems.append(str(e)))
    page.goto(BASE, wait_until="networkidle")
    page.wait_for_timeout(3500)
    page.screenshot(path=str(OUT / "01-hero.png"))

    check("page title (EN)", "Actuary" in page.title(), page.title())
    check("html lang is en", page.evaluate("document.documentElement.lang") == "en")
    check("skip link exists", page.locator("a.skip-link").count() == 1)
    check("one h1", page.locator("h1").count() == 1)
    check("sections in order", page.evaluate(
        "[...document.querySelectorAll('main > section')].map(s => s.id).join(',')"
    ) == "home,projects,explore,story,skills,about,contact")

    # Hero proof is visible without hovering
    check("hero shows the proof line", "3 million death records" in page.locator("#home").inner_text())
    check("hero axis labels not covered by the hint", page.locator("#home svg text", has_text="100").count() >= 1)

    # Explorer numbers: men at 40 must match the project's results (4.1x, 6.62 vs 1.74 per 1,000)
    page.locator("#explore").scroll_into_view_if_needed()
    page.wait_for_timeout(1600)
    txt = page.locator("#explore").inner_text()
    check("explorer: 4.1x at 40 (men)", "4.1×" in txt)
    check("explorer: premium 6.62 vs 1.74", "6.62" in txt and "1.74" in txt, "")
    check("explorer: ~74% too cheap", "74%" in txt)
    page.screenshot(path=str(OUT / "02-explore-men40.png"))
    # Version 2: insured lives, men at 40 (0.85 per 1,000 of cover on the insured table, 13% of the population's rate)
    page.locator("#explore button[role=radio]", has_text="Insured lives").click()
    page.wait_for_timeout(1400)
    txt = page.locator("#explore").inner_text()
    check("explorer insured: premium 0.85 vs 6.62 vs 1.74", "0.85" in txt and "6.62" in txt and "1.74" in txt)
    check("explorer insured: dies at 13% of the population rate", "13% of the population" in txt)
    check("explorer insured: no estimate warning at 40", "is an estimate" not in txt)
    page.screenshot(path=str(OUT / "02b-explore-insured-men40.png"))
    page.locator("#explore-age").fill("65")
    page.wait_for_timeout(1000)
    check("explorer insured: estimate warning past 60", "is an estimate" in page.locator("#explore").inner_text())
    page.locator("#explore-age").fill("40")
    page.locator("#explore button[role=radio]", has_text="Whole population").click()
    page.wait_for_timeout(1000)
    page.locator("#explore button[role=radio]", has_text="Women").click()
    page.wait_for_timeout(1200)
    txt = page.locator("#explore").inner_text()
    check("explorer: women at 40 -> 1.5x", "1.5×" in txt)
    page.screenshot(path=str(OUT / "03-explore-women40.png"))
    page.locator("#explore-age").fill("65")
    page.wait_for_timeout(1200)
    check("explorer: slider updates readout", page.locator("#explore label").inner_text().find("65") >= 0)

    # Projects: case study, gallery, lightbox
    page.locator("#projects").scroll_into_view_if_needed()
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / "04-projects.png"))
    page.get_by_role("button", name="Read the case study").click()
    page.wait_for_timeout(900)
    check("case study opens", page.locator("#flagship-case").inner_text().count("Rebuilt") >= 1)
    page.screenshot(path=str(OUT / "05-case-study.png"), full_page=False)
    page.get_by_role("tab", name="The pandemic").click()
    page.wait_for_timeout(500)
    page.locator("button[aria-label^='Enlarge']").click()
    page.wait_for_timeout(500)
    check("lightbox opens (dialog)", page.locator("dialog[open]").count() == 1)
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(200)
    check("lightbox arrow key advances", "4 of 6" in page.locator("dialog[open]").inner_text())
    page.screenshot(path=str(OUT / "06-lightbox.png"))
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    check("lightbox closes with Escape", page.locator("dialog[open]").count() == 0)

    # Skills: evidence caption
    page.locator("#skills").scroll_into_view_if_needed()
    page.wait_for_timeout(900)
    chip = page.get_by_role("button", name="Monte Carlo Simulation", exact=False).first
    chip.hover()
    page.wait_for_timeout(200)
    check("skills: hover shows where it was used", "simulated aggregate claims" in page.locator("#skills").inner_text())
    page.screenshot(path=str(OUT / "07-skills.png"))

    # Story section pinned frames
    page.locator("#story").scroll_into_view_if_needed()
    page.evaluate("document.getElementById('story').scrollIntoView()")
    page.wait_for_timeout(600)
    for i, off in enumerate([700, 1300, 2000]):
        page.evaluate(f"window.scrollTo(0, document.getElementById('story').offsetTop + {off})")
        page.wait_for_timeout(700)
        page.screenshot(path=str(OUT / f"08-story-{i}.png"))

    # Command menu
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(300)
    page.keyboard.press("Control+k")
    page.wait_for_timeout(400)
    check("command menu opens with Ctrl+K", page.locator("dialog[open][aria-label='Command menu']").count() == 1)
    page.keyboard.type("dashb")
    page.wait_for_timeout(200)
    check("command menu filters", page.locator("[role=option]").count() == 1)
    page.screenshot(path=str(OUT / "09-palette.png"))
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    page.keyboard.press("Control+k")
    page.keyboard.type("espa")
    page.keyboard.press("Enter")
    page.wait_for_timeout(1200)
    check("language switches to Spanish from the menu", page.evaluate("document.documentElement.lang") == "es")
    check("Spanish title", "Actuaría" in page.title(), page.title())
    check("lang stored", page.evaluate("localStorage.getItem('lang')") == "es")
    first_stat = page.locator("#home dl dt").first.inner_text()
    check("hero numbers do not recount after a language switch", first_stat.strip() == "746 mil", first_stat)
    page.screenshot(path=str(OUT / "10-hero-es.png"))
    for sec in ["projects", "explore", "story", "skills", "about", "contact"]:
        page.evaluate(f"document.getElementById('{sec}').scrollIntoView()")
        page.wait_for_timeout(1800)
        page.screenshot(path=str(OUT / f"11-es-{sec}.png"))
        hidden = page.evaluate(
            """(id) => [...document.querySelectorAll('#' + id + ' h2 > span')].filter(w => {
                const a = w.getBoundingClientRect(), b = w.firstElementChild.getBoundingClientRect();
                return b.top < a.top - 2 || b.bottom > a.bottom + 2;
            }).length""", sec)
        check(f"section title is visible: {sec}", hidden == 0, f"{hidden} words still hidden")
    page.evaluate("window.scrollTo(0,0)")
    page.get_by_role("button", name="English").click()
    page.wait_for_timeout(900)
    check("language switches back to English", page.evaluate("document.documentElement.lang") == "en")

    # Motion pause
    before = infinite_animations(page)
    page.get_by_role("button", name="Pause animations").first.click()
    page.wait_for_timeout(700)
    after = infinite_animations(page)
    check("pause stops infinite animations", before > 0 and after == 0, f"{before} -> {after}")
    check("data-motion is reduced", page.evaluate("document.documentElement.dataset.motion") == "reduced")
    page.screenshot(path=str(OUT / "12-paused.png"))
    page.get_by_role("button", name="Play animations").first.click()
    page.wait_for_timeout(500)
    check("play resumes", infinite_animations(page) > 0)

    # Theme
    page.get_by_role("button", name="Dark theme").click()
    page.wait_for_timeout(1000)
    check("dark theme applied", page.evaluate("document.documentElement.dataset.theme") == "dark")
    page.screenshot(path=str(OUT / "13-dark-hero.png"))
    for sec in ["projects", "explore", "skills"]:
        page.evaluate(f"document.getElementById('{sec}').scrollIntoView()")
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUT / f"14-dark-{sec}.png"))

    check("no console errors or warnings", not problems, " | ".join(problems[:4]))

    # Accessibility scan, light and dark
    page.evaluate("window.scrollTo(0,0)")
    for theme in ("light", "dark"):
        page.get_by_role("button", name=f"{theme.capitalize()} theme").click()
        page.wait_for_timeout(900)
        page.add_script_tag(path=str(AXE))
        res = page.evaluate(
            "axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}).then(r => r.violations.map(v => ({id: v.id, impact: v.impact, n: v.nodes.length, sample: v.nodes[0].target.join(' ') + ' :: ' + (v.nodes[0].any[0] && v.nodes[0].any[0].message || '').slice(0, 140)})))"
        )
        check(f"axe {theme}: no violations", not res, json.dumps(res)[:900])
    ctx.close()

    # ── Responsive overflow check ──
    for w, h in [(360, 740), (390, 844), (768, 1024), (1024, 768), (1280, 800), (1920, 1080)]:
        ctx = browser.new_context(viewport={"width": w, "height": h}, is_mobile=w < 700, has_touch=w < 700)
        pg = ctx.new_page()
        pg.goto(BASE, wait_until="networkidle")
        pg.wait_for_timeout(1500)
        # scroll through so every reveal runs
        total = pg.evaluate("document.documentElement.scrollHeight")
        y = 0
        while y < total:
            pg.evaluate(f"window.scrollTo(0,{y})")
            pg.wait_for_timeout(120)
            y += h * 0.8
        sw = pg.evaluate("document.documentElement.scrollWidth")
        check(f"no horizontal overflow at {w}px", sw <= w, f"scrollWidth {sw}")
        if w in (390, 768):
            pg.evaluate("window.scrollTo(0,0)")
            pg.wait_for_timeout(400)
            pg.screenshot(path=str(OUT / f"20-w{w}-top.png"))
            for sec in ["projects", "explore", "skills", "contact"]:
                pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()")
                pg.wait_for_timeout(700)
                pg.screenshot(path=str(OUT / f"21-w{w}-{sec}.png"))
        ctx.close()

    # ── Reduced motion (system setting) ──
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    pg = ctx.new_page()
    pg.goto(BASE, wait_until="networkidle")
    pg.wait_for_timeout(1500)
    check("system reduced motion: data-motion reduced", pg.evaluate("document.documentElement.dataset.motion") == "reduced")
    check("system reduced motion: no infinite animations", infinite_animations(pg) == 0, str(infinite_animations(pg)))
    check("system reduced motion: toggle disabled", pg.locator("button[aria-label*='reduced motion']").first.is_disabled())
    pg.evaluate("document.getElementById('story').scrollIntoView()")
    pg.wait_for_timeout(800)
    check("story is stacked (not pinned) when motion is reduced", pg.locator("#story .sticky").count() == 0)
    ctx.close()

    # ── ?lang=es link ──
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})
    pg = ctx.new_page()
    pg.goto(BASE + "/?lang=es", wait_until="networkidle")
    pg.wait_for_timeout(1200)
    check("?lang=es opens in Spanish", pg.evaluate("document.documentElement.lang") == "es")
    ctx.close()
    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)} passed, {len(failed)} failed")
sys.exit(1 if failed else 0)
