# Inspiration board — Awwwards data/AI survey

Research only. Nothing here has been built. Sources: 6 sites picked from the
[Awwwards Data Visualization feed](https://www.awwwards.com/websites/data-visualization/),
the [AI in Design Report 2026](https://stateofaidesign.com/), and the 5 named
companies (Patch AI, Zig.ai, Oryzo AI, MindMarket, Terminal Industries) — all
visited live via Chrome DevTools, not judged from thumbnails. Screenshots for
every site are in `prototype/research/`.

---

## 1. Site-by-site table

| Site | Technique carrying the weight | Driver | Weight / dependency | Vanilla-feasible | Est. hours (vanilla) |
|---|---|---|---|---|---|
| **Cerebrium.ai** | WebGL background canvas (`BackgroundCanvas`) + cursor dot-field (`InteractiveDots`) + GSAP-driven scramble-text headline + 4 distinct animated feature cards (world-map, range-chart, terminal typing, line chart) + carousel | Scroll (GSAP ScrollTrigger) + pointer + IntersectionObserver | Astro build, ~50 JS chunks, GSAP core+3 plugins, Lottie runtime — genuinely heavy, real infra-company budget | **Partial** — individual patterns yes, the whole system no | 4-8h per pattern borrowed |
| **Ausdata.ai** | WebGL canvas hero backdrop, otherwise mostly typographic | Scroll | Next.js/Turbopack, 2 canvases | Y (typography); N (WebGL bg) | 1h (type) / 10h+ (WebGL) |
| **Neuromantix (axiom)** | WebGL canvas ×2, all-caps oversized wordmark hero | Scroll/pointer (unconfirmed exact trigger) | Next.js | N (WebGL) | 10h+ |
| **Signal IQ (Pine Labs)** | Literal data-parsing visual — "What your parser sees" rendered as real extracted fields, not decoration | Scroll reveal | Framer-hosted, 1 canvas, 16 SVG | **Y** — this is the one genuinely content-driven technique in the set | 3-4h |
| **Negotiated Intelligence** | Full WebGL art piece (2 canvases) | Unclear — this is an art-biennale entry, not a product site | Heavy, experimental | N — wrong register, see §4 | n/a |
| **gptagency.io** | Zero canvas, zero WebGL. Fraunces serif display (73px) + staggered DOM/SVG reveals carry 100% of the "premium" feeling | Scroll (IntersectionObserver-style reveals) | Next.js, plain CSS/SVG | **Y** — fully vanilla-feasible, no canvas needed at all | 2-3h |
| **AI in Design Report 2026** | 120px display type (Beausite Classic) + editorial scroll pacing, zero canvas | Scroll | Framer-hosted | Y (type scale); site itself no-build N/A | 1h |
| **Patch AI** | 2× 2D canvas (no WebGL — likely simple animated charts), 152px hero headline (largest in the set) | Scroll/load | Next.js-ish, custom `PP Right` font | Y (2D canvas is exactly our budget) | 3-5h |
| **Zig.ai** | 1 canvas (no WebGL), Archivo display + Azeret Mono accents, otherwise SVG/DOM | Scroll | Webflow | Y | 2-3h |
| **Oryzo AI (SOTD)** | **Gaussian-splat 3D point-cloud renderer** running in a Web Worker (`SplatsWorker`), 6 canvases, real WebGL, plus a Vimeo video embed | Scroll + pointer (orbit-style) | Astro, GPU-bound splat renderer — a genuine 3D asset pipeline | **N** — this is the most technically advanced thing in the whole set and it is not a weekend build | 40h+, needs 3D tooling we don't have |
| **MindMarket (SOTD)** | 14 canvases, but they're **Rive** state-machine icon animations (not one big hero piece), plus GSAP DrawSVG line-drawing | Scroll + IntersectionObserver | Astro, Rive runtime, GSAP DrawSVGPlugin | N (Rive needs its own editor/toolchain); DrawSVG **Y** in vanilla (stroke-dashoffset) | 2h (vanilla line-draw) |
| **Terminal Industries (SOTD)** | Long-form scrollytelling (~17.5 viewport-heights), SVG-heavy, 1 canvas | Scroll | SuisseIntl + Geist Mono, generous section padding (40-120px) | Y (typography/pacing); page LENGTH itself not something to copy, see §4 | 1h |

---

## 2. The 5 techniques worth stealing, ranked (impact ÷ effort)

**1. Three-tier type system: display face + body face + mono accent for data/labels.**
Every single site in this set does this — 7 of 11 use a dedicated monospace face
specifically for eyebrows, stats, and data labels (Space Mono, Geist Mono, DM
Mono, IBM Plex Mono, Azeret Mono...). MSM already has a 2-font system
(Space Grotesk + Inter) and zero mono. Adding one mono face is a CSS-token
change, not a rebuild.
→ **Section: About.** The three stat cards (`about__proof-stat`) are exactly
where a mono numeral face reads as "this is real data," not decoration —
lowest-effort, highest-thematic-fit placement on the whole site.

**2. Oversized, fluid display type — go further than the current clamp.**
H1 sizes across the set ran 70-152px, averaging well above MSM's current
`--font-size-h1` ceiling of 4rem/64px. This is a token-value change, already
inside the existing `clamp()` infrastructure in `tokens.css`.
→ **Section: Hero.** Raise the top end of `--font-size-h1`'s clamp; no new
CSS architecture needed, just new numbers backed by this evidence.

**3. Per-line/per-word stagger reveal on headings, not just fade-up blocks.**
MSM already has a working `reveal` + IntersectionObserver system
(`js/script.js`) — this extends it, doesn't replace it. Split a heading's
text into `<span>`-wrapped words at render time, stagger their
transition-delay the same way `.reveal-group` already staggers cards.
Zero new libraries; GSAP's SplitText-equivalent is doable with vanilla JS on
short, controlled headline strings like ours.
→ **Section: Services.** "Three ways we help you put data & AI to work" —
the words resolving in sequence mirrors the section's own "three ways" framing.

**4. A real (not decorative) small chart replacing static text in a case study.**
Signal IQ's "what your parser sees" is the one technique in the whole set
that's unambiguously *content*, not flourish — and it's the closest analog
to what this site already claims to sell. The QuantivRisk case study
currently describes a probability breakdown in prose only.
→ **Section: Case Studies (work).** Render the QuantivRisk probability
breakdown as an actual small horizontal bar chart (plain 2D canvas or even
styled `<div>` bars with the existing `js-counter` count-up pattern already
built for About) — cheap, and it's the one card where a real chart replaces
a claim instead of illustrating it.

**5. Vanilla line-draw SVG accents (stroke-dashoffset), no plugin needed.**
MindMarket's GSAP DrawSVGPlugin effect is a paid-plugin dependency, but the
underlying technique — a path animating from `stroke-dashoffset: length` to
`0` on scroll-into-view — is native CSS/SVG, zero libraries, and we already
have the IntersectionObserver plumbing to trigger it.
→ **Section: How It Works.** Replace the plain numbered list's implicit
"01 → 02 → 03" ordering with an actual connecting line that draws itself
between the three steps as the user scrolls — makes the *process* visible
instead of just labeled.

*(The in-progress ASCII data-field hero is treated as a given per your
instructions — not re-ranked here, but it clearly belongs in this same
"technique carries real meaning, not decoration" bucket per §4's litmus test.)*

---

## 3. Proposed visual language

**Typefaces** (display + body + mono, all free/webfont-available — the
pattern from every site above, none of the paid faces like PP Right or PP
Telegraf):
- Display: keep **Space Grotesk** (already in use, already licensed/hosted,
  already token-wired) — it's doing the same job Archivo/SuisseIntl/Beausite
  do elsewhere in this set. No reason to replace a working choice.
- Body: keep **Inter** — it's the single most common body face in the whole
  survey (appears in 6/11 sites verified via computed styles). Confirms the
  existing choice rather than changing it.
- **New: a mono accent face.** Recommend **JetBrains Mono** or **IBM Plex
  Mono** (IBM Plex Mono appears directly in the survey, at Terminal
  Industries/Signal IQ-adjacent products) for eyebrow labels, stat values,
  and the new chart in §2.4.

**Type scale** (extending, not replacing, the existing `clamp()` tokens in
`tokens.css` — actual px values, evaluated at a 1440px viewport):
| Token | Current | Proposed |
|---|---|---|
| `--font-size-h1` | clamp(36px, ..., 64px) | clamp(40px, ..., **88px**) |
| `--font-size-h2` | clamp(30px, ..., 44px) | clamp(30px, ..., **56px**) |
| new `--font-size-mono-label` | — | **13px**, `--tracking-eyebrow` letter-spacing, mono face |
| `--font-size-base` | 16px | unchanged — every site in the set keeps body copy at 15-16px even with a huge display size; the contrast is the point |

**Palette** — no new hues. Every site surveyed runs 1 near-black/near-white
base + 1-2 accent hues used *sparingly* (a headline word, a button, a chart
line) rather than large color blocks. MSM's existing tokens already fit this
shape (`--color-accent` #3b82f6, `--color-accent-secondary` #0d9488) — the
recommendation is **usage**, not new hex values: let the mono/data face and
the accent colors do more of the "this is data" signaling (chart strokes,
counted-up numerals) rather than confining accent color to buttons/badges.

**Spacing** — no change needed. Sampled section padding across the surveyed
sites ran 40-120px top/bottom; MSM's `--section-padding-y` (`--space-12` =
96px) already sits inside that range. The "more whitespace" impression these
sites give comes from type scale and motion pacing, not dramatically more
padding — don't inflate the spacing scale chasing a feeling that's actually
coming from typography.

**Motion vocabulary** (derived from the reveal timings observed, kept inside
what a debounced IntersectionObserver + CSS transitions can do — no RAF
loops needed for any of the 5 techniques above):
- Reveal-in: `600ms cubic-bezier(0.16, 1, 0.3, 1)` (matches the existing
  `--ease-out-expo` token already in `tokens.css` — reuse, don't add).
- Stagger step between siblings (words, cards): `60-90ms` per item — tighter
  than MSM's current `80ms` card-stagger is fine to leave as-is.
- Line-draw (§2.5): `800-1200ms linear` on `stroke-dashoffset`, triggered
  once at 20% visibility, matching the existing `revealObserver` threshold.

**CLAUDE.md discipline check:** none of the above requires loosening the
token contract. The mono face and two new type-scale values are additive
tokens, not ad-hoc values — they'd get added to `styles/tokens.css` the same
way the existing scale was built, keeping the "every value resolves to a
token" rule intact.

---

## 4. What NOT to copy

- **Gaussian-splat / big WebGL 3D scenes** (Oryzo, Neuromantix, Ausdata,
  Cerebrium's background canvas). These need a 3D asset pipeline and GPU
  shader work well outside a vanilla-HTML/CSS/JS, no-build budget. This is
  also exactly the shape of thing that's been abandoned twice already in
  this repo's history (the scatter-to-trend canvas hero, the full ASCII
  system) — a third heavy from-scratch canvas attempt without a clear static
  spec is the highest-risk item on this whole board.
- **Rive icon animations** (MindMarket). Genuinely nice technique, but it's
  a foreign toolchain (Rive's own editor + `.riv` file format + runtime
  library) for a site that has explicitly stayed dependency-free. Not
  vanilla-feasible at all.
- **The Negotiated Intelligence art piece.** It's a biennale entry, not a
  product site — full-bleed experimental WebGL is the right register for art,
  the wrong register for a credibility-driven B2B consultancy. Including it
  in the table at all is a caution, not a source to draw from.
- **152px/139px/123px hero type with thin supporting proof underneath it**
  (Patch AI, MindMarket, Oryzo). On a well-known, well-funded product this
  reads as confidence. On a solo analytics consultancy without that
  reputation already established, an enormous headline over a mostly-empty
  hero reads as style covering for a lack of substance — the fix here isn't
  "don't go big," it's "if you go big, keep the proof (case studies,
  numbers) visible immediately after, not buried at section 6 of 10."
- **17-viewport-height scrollytelling** (Terminal Industries). Fine for a
  category-defining brand piece; wrong for a 10-section site whose job is
  getting someone to book a call. Every extra screen of scroll is a chance
  to lose the CTA, not a chance to look grander.

---

## Screenshots

All hero + section captures saved to `prototype/research/` —
`{site}-hero.png`, `{site}-section2.png`, `{site}-section3.png` where taken.
