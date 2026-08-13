## Design tokens

These tokens are mirrored in styles/tokens.css — that file is the implementation, this block is the contract. Keep them in sync.

Consolidated from a full-site audit (every stylesheet, every color/font/spacing/radius value, resolved through every `var()` chain) done as a consistency pass on the live site — not a redesign. The dark-navy identity, the layout, and the copy are unchanged; only inconsistent/duplicate values were collapsed. See "Audit notes and judgment calls" below for the reasoning behind each non-obvious decision.

```css
:root {
  color-scheme: light;

  /* Core identity colors — light-mode. 8 slots (top of the 6-8 budget):
     ground, ground-tint, surface, text, muted text, border, accent,
     accent-secondary. ground-tint and accent-secondary both do real
     structural work (the alternating section-band rhythm; the wordmark
     gradient + "work" card accent) so both earned a slot rather than one
     generic "+1 more". */
  --color-ground: #f8fafc;
  --color-ground-tint: #eef4ff;
  --color-surface: #ffffff;
  --color-text: #0b0f19;
  --color-text-muted: #475569;
  --color-border: rgba(15, 23, 42, 0.08);
  --color-border-strong: rgba(15, 23, 42, 0.16);
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  --color-accent-active: #1d4ed8;
  --color-accent-soft: rgba(59, 130, 246, 0.1);
  --color-accent-glow: rgba(59, 130, 246, 0.45);
  --color-accent-transparent: rgba(59, 130, 246, 0);
  --color-accent-secondary: #0d9488;
  --color-accent-secondary-soft: rgba(13, 148, 136, 0.1);

  /* Inverted context — hero, cta-band, .section--inverted. Parallel
     values for the roles above, not new "identity colors": the dark
     sections are explicitly part of the identity that stays. */
  --color-ground-inverted: #0b0f19;
  --color-surface-inverted: rgba(255, 255, 255, 0.04);
  --color-chip-inverted: rgba(255, 255, 255, 0.1);
  --color-text-inverted: #f5f7fa;
  --color-text-inverted-muted: #97a3b8;
  --color-border-inverted: rgba(255, 255, 255, 0.12);
  --color-border-inverted-strong: rgba(255, 255, 255, 0.3);
  --color-scrim: rgba(11, 15, 25, 0.5);

  /* Hero-specific effects — the scrim gradient was hand-tuned and
     verified (dense sampling across the video, worst-case contrast
     checked) in an earlier pass; kept as exact literals-turned-tokens
     rather than re-derived at different alphas, so the verified
     contrast guarantee can't drift by accident. */
  --color-hero-scrim-1: rgba(11, 15, 25, 0.92);
  --color-hero-scrim-2: rgba(11, 15, 25, 0.88);
  --color-hero-scrim-3: rgba(11, 15, 25, 0.65);
  --color-hero-scrim-4: rgba(11, 15, 25, 0.35);
  --hero-spotlight-radius: 500px;

  /* Functional — contact-form validation only. Exempt from the identity
     palette budget: semantic (red/green), not a brand decision. */
  --color-error: #dc2626;
  --color-error-ring: rgba(220, 38, 38, 0.15);
  --color-success: #16a34a;
  --color-success-text: #15803d;
  --color-success-soft: rgba(22, 163, 74, 0.08);
  --color-success-border: rgba(22, 163, 74, 0.3);

  --color-shine: rgba(255, 255, 255, 0.35); /* primary-button hover sweep */

  /* Shadow — already a clean 3-tier system, left as-is. */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 4px 8px rgba(15, 23, 42, 0.04), 0 16px 40px rgba(15, 23, 42, 0.12);
  --shadow-drop-lg: 0 12px 28px rgba(15, 23, 42, 0.14);

  /* Type — 3 families. Inter/Space Grotesk unchanged. --font-family-mono
     is new and role-restricted: numerals, eyebrows, labels, metadata
     only — never body copy or headings. 7-step static scale. h1/h2
     ceilings raised — see "Audit notes" below. */
  --font-family-heading: "Space Grotesk", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, sans-serif;
  --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-family-mono: "IBM Plex Mono", ui-monospace, SFMono-Regular,
    "Cascadia Mono", Menlo, Consolas, monospace;

  --font-size-xs: 0.8125rem;    /* 13px */
  --font-size-sm: 0.9375rem;    /* 15px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px — was 1.375rem/22px, snapped */
  --font-size-2xl: 1.5rem;      /* 24px — new step */
  --font-size-3xl: 1.75rem;     /* 28px — new step */

  /* Same step as --font-size-xs — separate token because mono labels
     are a distinct semantic role, not general small text, even though
     the value coincides today. Pairs with --tracking-eyebrow at call
     sites; no new tracking token. */
  --font-size-mono-label: var(--font-size-xs);

  --font-size-h3: clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem);   /* xl .. 2xl */
  --font-size-stat: clamp(1.75rem, 1.4rem + 1.4vw, 2.5rem);  /* starts at 3xl */
  --font-size-h2: clamp(1.875rem, 1.5rem + 2.2vw, 3.5rem);   /* 30-56px, fluid, was 30-44px */
  --font-size-h1: clamp(2.5rem, 1.75rem + 3vw, 4.5rem);      /* 40-72px, fluid, was 36-64px */

  --line-height-tight: 1.1;
  --line-height-snug: 1.3;
  --line-height-base: 1.6;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  --tracking-h1: -0.035em;
  --tracking-h2: -0.025em;
  --tracking-h3: -0.015em;
  --tracking-eyebrow: 0.08em;
  --tracking-logo: -0.02em; /* navbar + footer wordmark — was duplicated as
    two separate literals; now genuinely coupled */

  /* Icon sizes — reuses the spacing scale where a size coincides with it
     (16/24/48px = --space-4/5/8); the rest (20/28/36/56px) is icon
     geometry, not layout spacing, so it gets its own small scale. */
  --icon-xs: var(--space-4);   /* 16px */
  --icon-sm: 1.25rem;          /* 20px */
  --icon-md: var(--space-5);   /* 24px */
  --icon-lg: 1.75rem;          /* 28px */
  --icon-xl: 2.25rem;          /* 36px */
  --icon-2xl: var(--space-8);  /* 48px */
  --icon-3xl: 3.5rem;          /* 56px */

  /* Spacing — 4px base. Already close to this shape; kept as-is. */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.5rem;     /* 24px */
  --space-6: 2rem;       /* 32px */
  --space-8: 3rem;       /* 48px */
  --space-10: 4rem;      /* 64px */
  --space-12: 6rem;      /* 96px */
  --space-16: 8rem;      /* 128px */

  /* Radius — exactly 2: one for cards, one for pills. */
  --radius-card: 16px;
  --radius-pill: 999px;

  /* Layout — one section max-width for grid/content sections, plus two
     narrower content-measure tokens that are a genuine, consistently
     applied second/third tier (not a leak — see notes below). */
  --container-max-width: 1200px;
  --container-max-width-md: 800px;
  --container-max-width-narrow: 640px;
  --container-padding: var(--space-5);

  --section-padding-y: var(--space-12); /* ONE value, top AND bottom, every section */

  --navbar-height: 76px;
  --navbar-offset-top: var(--space-4);

  /* Component-specific minimums — not margin/padding/gap, so they don't
     fit the spacing scale; named tokens instead of a forced snap. */
  --hero-min-height: 560px;
  --hero-min-height-lg: 680px;   /* >=1024px */
  --textarea-min-height: 120px;

  /* Client logo chip — 40/88px don't fit the icon scale (tops out at
     --icon-3xl, 56px); own two-value scale instead of a forced fit. */
  --client-logo-chip-size: 40px;
  --client-logo-chip-size-lg: 88px;

  /* Client logo strip (.work__logos) — separate, larger-format treatment,
     decoupled from the chip above. Two values because the two layout
     modes have different width budgets, not because one is a bigger
     breakpoint variant of the other — see the component note below. */
  --client-logo-strip-height: 120px;      /* stacked, <1280px */
  --client-logo-strip-height-row: 108px;  /* single row, >=1280px */

  /* Duration only — no timing function baked in. CSS defaults to `ease`
     automatically at any call site that doesn't append one; do not add
     `ease` back after these. --ease-out-expo is the one timing-function
     token — append it explicitly only where a call site wants that
     specific curve. Never combine a token that already bundles a timing
     function with an appended one (bare `ease` or --ease-out-expo) —
     two timing-functions in one `transition` item is invalid shorthand
     syntax, silently dropped to `all 0s ease 0s` with no warning. See
     audit notes: this is exactly why .reveal and .stagger-word never
     animated. */
  --transition-fast: 150ms;
  --transition-base: 250ms;
  --transition-slow: 400ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  --z-navbar: 100;
  --z-mobile-menu: 90;
}
```

### Structural rules

- Every color, size, and space value in every stylesheet must resolve to a token above. No ad-hoc values. If a value you need isn't here, ask first.
- Identical top and bottom padding on every section (`--section-padding-y`). The hero is the one necessary exception: its top padding must also clear the fixed navbar, so it's `navbar-height + navbar-offset-top + --space-8` (a deliberately-tuned, previously-approved 48px gap below the nav) rather than the flat token — its bottom padding is `--section-padding-y` like everywhere else.
- Every section follows the same internal order: eyebrow → h2 → subhead → content, same sizes/colors for those roles everywhere (`.section-heading__eyebrow` margin-bottom is `--space-3` everywhere now — the 4 sections that overrode it to `--space-4` had that override removed).
- `--container-max-width` (1200px) is the shared section-container width. `--container-max-width-narrow` (640px, section intros + the CTA band) and `--container-max-width-md` (800px, the FAQ list) are kept as deliberate narrower measures for centered/short-form content — forcing them to 1200px would visibly change those sections' layout, not just tidy up tokens.
- `--radius-card` for every card/input/badge/icon-box; `--radius-pill` for every pill/button/fully-round chip. Nothing else.
- The accent blue (`--color-accent*`) is for interactive elements. **Known, intentional exception**: every section-heading eyebrow badge uses `--color-accent-hover` as static label text — not interactive, technically "decoration." Recoloring ~9 badges site-wide would be the single most visible change in this whole pass and reads as changing the identity, not cleaning it up, so it was left alone. Flagging in case that call should go the other way.
- `--color-accent-secondary` (teal) means **case-study identity** specifically — the `.card--work` left border and client-name tag — not a general "positive outcome" or "secondary brand" color. Audited every existing use before extending it anywhere else (considered for Problem's before/after treatment and About's stat cards, both times traced back to this same scoped meaning and declined) — reusing it for sentiment or emphasis elsewhere would be meaning drift, not reuse. If a future section wants a second accent color, that's a new decision to make deliberately, not a reason to borrow this one.

### Audit notes and judgment calls

- `--color-text` and `--color-ground-inverted` intentionally share the same hex (`#0b0f19`) — not a bug, just the brand navy doing two jobs (light-mode text, dark-mode background).
- `--color-ground-tint` looked like a near-duplicate of `--color-ground` by hex value alone, but it's the `.section--tint` alternating-band background used across 4 of 9 sections — a deliberate rhythm device, not drift. Kept.
- Four white-alpha overlays on dark backgrounds (card surface, chip/hover background, border, border-hover, decorative shine) are four different real roles, not one role drifting — kept as 4 named tokens instead of forcing one value that would flatten a real state distinction (e.g. hover no longer visibly brightening).
- `--font-family-mono` (IBM Plex Mono) is scoped narrowly on purpose: numerals, eyebrows, labels, metadata only, never body or headings, so it can't drift into a third display voice. Static rather than variable (no variable build exists for this face), two weights only (600/700 — the only weights any mono-styled element uses), each subsetted to printable ASCII + en dash + curly apostrophe (~4.6KB each vs ~140KB unsubsetted).
- **The site is indexable.** `robots.txt` now allows all (`Allow: /`, plus a `Sitemap:` line pointing at `sitemap.xml`) and `index.html`'s meta robots is `index, follow`, replacing a `noindex, nofollow` + `Disallow: /` pair that was documented as a deliberate "preview build" marker. The site had been live at a public GitHub Pages URL this whole time — unfindable, but never actually access-controlled (GitHub Pages on a public repo has no gate at any tier, which is exactly what the removed comment said) — so this was reversed deliberately, not left over. `sitemap.xml` lists all four indexable pages (the homepage plus the three case-study pages below) with real `lastmod` dates pulled from git history, not guessed. Don't restore `noindex` on the assumption it's still the intended state — it isn't.
- `--font-size-h1`'s ceiling is 72px, not 88px. The condition for 88px was "real proof near the hero" — without it, oversized hero type over thin proof reads as "style covering for missing substance." That condition has since been met (`.hero__proof`, a measured figure linked to the case study that earned it) and 88px was still declined: one number with no baseline to compare against is thin proof on its own — met the condition's letter, not its spirit. Revisit only if `.hero__proof` gains a second, comparable figure (a baseline, a benchmark, a before/after) — not by re-arguing the same one.
- `--font-size-mono-label` is a semantic alias for `--font-size-xs` (13px), not a new value — the mono-label role is distinct from general small text even though the number matches today.
- **`.reveal` (and everything built on its pattern) didn't animate for most of this project's history — fixed at the token level.** `--transition-slow` already bundled a timing function (`400ms ease`); appending a second one (`var(--ease-out-expo)`) at the call site made the `transition` shorthand invalid, silently dropped to `all 0s ease 0s` with no warning. Confirmed via real `transitionstart`/`transitionend` timestamps, not just computed style. Six declarations were affected sitewide — `.reveal`, `.stagger-word`, both `.navbar__scrim` rules, the mobile nav panel, `.faq__panel` — meaning the mobile menu and FAQ accordion were also snapping instantly rather than animating. `--transition-fast/base/slow` now hold duration only (see the contract block above); the fix is structural, so the failure mode can't recur unless a call site starts appending its own timing function to one of these tokens again — don't.

## Known issues

- **Navbar CLS (~0.001), open.** `navbar__nav` and `navbar__cta` shift together on ~3 of 8 cold loads at 1440px (0 of 8 at 390px, where both are out of normal flow below 768px and structurally can't shift). Likely cause: `.navbar__logo` is the only navbar element set in `--font-family-heading` (Space Grotesk); its font swap changes its own box, and `align-items: center` on the shared flex row (`.navbar__inner`) drags its normal-flow siblings along — which is why the shift shows up on `navbar__nav`/`navbar__cta` rather than the logo itself. Neither the transition-delay fix nor the Space Grotesk preload closes it: the six declarations the transition fix touched don't include any navbar element, and the preload (document-wide, so it does reach the logo) only reduced this from every load to ~3/8 — same "shrinks the window, doesn't close it" behavior as the hero below, but with no `fonts.ready` gate here to correct the remainder. Small enough to not fail a CLS budget alone; don't bundle a fix into unrelated work.
- **Hero H1 word-stagger CLS: mitigated, not eliminated.** Wrapping the H1's words in `.stagger-word` spans gave the Layout Instability API something to attribute a pre-existing font-swap reflow to for the first time (plain text has no per-word element to pin a position change to, so the same reflow was always happening and simply wasn't measurable before). Two independent, non-substitutable mitigations are shipped: a `document.fonts.ready` gate in `script.js` (word-wrapping waits for the real font, 2s safety timeout) stops the reveal from running against the pre-swap layout, and an `index.html` preload of `space-grotesk-variable.woff2` shrinks the swap window itself. Together they hold CLS at the pre-existing ~0.00004 baseline across cold/warm runs at both 390 and 1440 — neither removes the underlying reflow, so don't remove either without re-measuring both.
- **About's "By the numbers" stats: better home is likely the end of Case Studies, not About. Logged, not scheduled.** The 19–30% MAPE figure among the three stats is the exact number the Zywave case study earns one section earlier; About currently just restates it next to unrelated bio copy. Moving the stat band there puts the numbers next to the evidence that makes them credible — a section-identity fix, not a scroll-depth fix (About and the end of Case Studies are the same distance down the page). Distinct from `.hero__proof`, which already covers scroll-depth by surfacing one figure near the hero for visitors who never reach either section.
- **No founder identity anywhere on the site — no name, no bio, no photo. Logged, not scheduled, deferred rather than new.** About speaks only as "MSM Analytics" throughout; no individual is named on any page. For a company-voice site this would be a stylistic choice; for a solo practice whose actual differentiator is direct access to the person doing the work, it's an unmet requirement — an external brand brief (outside this repo) lists "a credible signal of the individual" as non-negotiable, so this isn't a new suggestion, it's a known gap that hasn't been closed yet. Surfaced while removing the footer's LinkedIn/X links (both `href="#"`, never wired up, removed rather than pointed at real profiles — see that commit): a *personal* LinkedIn link was considered and explicitly deferred, because the site currently has no founder name or photo for a personal profile to attach to, and linking a bare company page would very likely read as thin rather than credible, which is its own version of the same problem. This item is the prerequisite for that link, not a parallel item — don't add a personal LinkedIn href without first giving the site a name, bio, and photo to hang it on.
- **Client logo strip (`.work__logos`) reads with more surrounding whitespace at 1024-1279px than at the final 1280px+ row layout. Logged, not scheduled.** Stacked (column) layout runs all the way up to 1280px (see the component note above for why — a single row can't fit all three marks inside `--container-max-width` below that point), so at laptop widths a single centered logo sits with real room to spare on both sides rather than filling the row the way it does once row layout kicks in. Not broken — no overflow, no distortion, verified at 1024px directly — just less tightly composed than the 768px and 1280px+ cases, which happen to fill their available width better by coincidence of aspect ratio. A third breakpoint (row layout at a smaller height, somewhere around 1024px) would tighten it, but that's real added complexity — a third height value — for a gap that reads as "less composed," not wrong. Revisit only if it actually reads worse in practice than it does in the reviewed screenshot, not preemptively.
- **No downloadable PDF for any case study. Logged, not scheduled — trigger-conditioned, not speculative.** Researched against Tiger Analytics' CPG one-pager (see `docs/case-study-ux-board.md` and `docs/logo-and-pdf-recommendations.md`); a condensed PDF is a real, distinct artifact (something forwardable inside a prospect's org, not just a page export) but only if it's genuinely condensed rather than a printed copy of the web page. Both realistic ways to produce one were rejected for now, not overlooked: a generated/build-tooled PDF means introducing a real build step, which this project has deliberately never had; a hand-authored PDF means a fourth untooled copy of each case study's claims, which is exactly the drift risk `scripts/check-consistency.js` exists to catch, and that script can't see into a PDF. Gating it behind a form was also rejected — the site has no backend anywhere (confirmed: the contact form has no `action`, no `fetch`, no third-party form service), so a gate would mean standing up infrastructure that doesn't exist for one download link; Tiger's own PDF, checked directly, turned out to be an ungated public href with no real access control, so there's no working pattern to copy there either. Build the first one only when a specific real prospect asks for something to forward — one hand-authored one-off for that specific case study, not a system for all three — and link it directly, no form.

## Case study detail pages

Three pages live in `case-studies/`, one per client, flat (`case-studies/<slug>.html`, one level of nesting) — no build step, no templating, matching this project's identity everywhere else. Hand-maintained duplication was chosen over a JS include (breaks `file://` preview, adds a guaranteed flash of missing nav — fights the CLS work above) or a build step (this project has never had one; "same vanilla stack, no build step" was a stated constraint, not just today's default). Each page hand-duplicates the navbar and footer from `index.html`, with every anchor rewritten to `../index.html#section` (a detail page has none of its own sections to anchor to — confirmed the scroll-spy observer safely no-ops on these hrefs rather than erroring). Same head boilerplate as `index.html` (fonts, tokens, favicon), own `<title>`/`<meta description>`, `index, follow`.

Section order, all reusing existing components rather than inventing page-specific ones:
1. Page header — back-link (`.case-study__back` → `index.html#work`), client tag (`.card--work__client`, reused verbatim — same meaning, client identity, not duplicated under a new name), `<h1>`, discipline line, a Result stat (`.case-study__result`).
2. Body sections (The problem / The approach / etc.) — prose capped at `--container-max-width-md` (same measure as the FAQ list, since this is an article now, not a landing grid), `.case-study__checklist` for any bold-lead-in bullet list (same checkmark treatment as Services' `.card--service__features`, renamed since it isn't card-scoped), `.case-study__tech-list`/`-tag` for the Technologies line (neutral mono chips — deliberately not the case-study teal, which stays scoped to client identity, not metadata; see the teal note above).
3. A lightweight closing CTA (`.case-study__cta`) — deliberately not `.cta-band`, which stays the homepage's one closing bookend.
4. "More case studies" — two teaser cards reusing `.card.card--work` verbatim, linking to the other two pages.

**Client logo chip** (`.client-logo-chip`, `--lg` modifier) — pairs with `.card--work__client` inside a shared `.card--work__header` row, on the homepage cards, both detail-page-header instances (`--lg`, 88px) of each page's own client, and every "More case studies" teaser card. The chip exists to solve a real inconsistency, not for decoration: the three source logo files (`assets/logos/`) were prepared three different ways — MSIG's is a genuinely transparent WebP, QuantivRisk's JPEG has a baked near-white background, Zywave's JPEG has a baked dark-navy background — and displayed edge-to-edge they'd read as three different *kinds* of image sitting next to each other, not one component with three fills. The chip's own white circular background + border normalizes all three into one frame without editing any source file. Tokens: `--client-logo-chip-size` (40px, cards) / `--client-logo-chip-size-lg` (88px, headers) — don't fit the icon scale (tops out at 56px) or its named steps, so they're their own two-value scale (mirrored in the design-tokens contract block above, per that block's own sync rule).

**Client logo strip** (`.work__logos`) — homepage-only, sits inside `#work` after the three case-study cards, closing the section rather than living as its own top-level section (so it doesn't disturb the `.section--tint` alternation rhythm, and stays visually tied to the three names the cards just introduced — no separate "Clients" label, since that context is already established by direct proximity, unlike a standalone logo-wall section introducing names for the first time). Greyscale, per the accent-color scoping rule above: full-color client marks here would introduce a second brand-color set with no relationship to `--color-accent-secondary`'s established case-study meaning. Decoupled from the chip entirely — separate assets, separate sizing, chip unchanged.

Uses three source-authoritative assets pulled directly from each client's own live site (not derivatives of the chip's files): `assets/logos/msig.webp` (the full mark+wordmark lockup, already verified transparent), `assets/logos/zywave-wordmark.svg` (a genuine vector wordmark copied verbatim from `zywave.com`'s own header — two flat fills, no background, no raster data), `assets/logos/quantivrisk-horizontal.webp` (the horizontal mark+wordmark lockup from `quantivrisk.com`'s own header, confirmed genuine alpha channel via canvas pixel sampling, not a derivative of the near-white-background `quantivrisk.jpg` the chip uses). Full lockups, not icon-only crops, deliberately — a logo strip is a wordmark context by convention (this is what every real precedent researched does), not the icon-badge context the chip is.

Two source aspect ratios collide inside `--container-max-width` (1200px): Zywave's and QuantivRisk's wordmarks are both roughly 4.4:1, wide enough that all three in a single row at a height in the 120-140px range doesn't fit any real gap — verified: at 120px height the three marks' combined natural width alone is ~1139px, leaving under 15px total for both gaps inside the container's 1152px content width. That's why the component has two height tokens instead of one, and why they're *not* a small/large pair the way the chip's are — `--client-logo-strip-height` (120px) is the taller value, used in the default **stacked** (column) layout, safe at any width because only one mark's width is ever measured against the container at a time; `--client-logo-strip-height-row` (108px, smaller) only applies once `.work__logos` switches to a single row at the `min-width: 1280px` breakpoint in `responsive.css` — deliberately this project's own widest documented breakpoint rather than the usual 768px/1024px ones, because 1280px is the first point with enough container width to fit all three marks on one line with a real (`--space-8`, 48px) gap. Below that, images render at the full 120px stacked height via `width: auto; max-width: 100%`, which also self-shrinks the widest marks gracefully on narrow phones without needing a dedicated mobile breakpoint.

Zywave's wordmark fill (`#0F2D52`) sits close to `--color-ground-inverted` and goes nearly invisible if ever placed on a dark/inverted background — confirmed by direct rendering, not assumed. Not a live bug: `.work__logos` lives inside `#work`, which has no `--tint`/inverted modifier, so it always sits on plain `--color-ground`. If this component or its assets are ever reused on an inverted section, that fact needs to be re-checked, not assumed still fine.

Every img inside `.client-logo-chip` carries a redundant `border-radius` in addition to the parent's `overflow: hidden` clip. This is defensive, not decorative: WebKit was observed painting `zywave.jpg` specifically to a compositing layer that bypassed the parent's clip entirely, rendering it as an unclipped square (reproduced in WebKit only, only on that file — same computed geometry as the working QuantivRisk chip otherwise; the two JPEGs differ structurally, Zywave lacking the ICC profile and 4:4:4 chroma sampling QuantivRisk's has, consistent with a known WebKit image-decode-path bug class). Giving the `img` its own `border-radius` clips regardless of which compositing path WebKit takes. Verified across Chromium/WebKit/Firefox on both the local build and the live site — don't remove it on the assumption the parent's `overflow: hidden` alone is sufficient, that's exactly the assumption that failed.

MSIG's chip uses a derived asset, `assets/logos/msig-mark.png` — not the original `msig.webp` — and needs no modifier at all; it just takes the same `object-fit: contain` + padding every other chip gets. That's the second half of a fix, not the original design: MSIG's source is a portrait mark+wordmark lockup (500×760), not a square icon like the other two, and an earlier version used a `--crop` modifier (`object-fit: cover; object-position: top; padding: 0`) to crop it live down to just the diamond. That shipped MSIG with no padding at all, edge-to-edge in the chip, while the other two sat inside visible white frames — inconsistent next to them, not deliberate. Tightening the padding to match doesn't fix it either: `cover` on a portrait source in a square box always preserves full width and crops height, and at any padding tight enough to match the other chips' breathing room, `object-position: top` provably clips ~8% off the diamond's bottom point (worked from the source's pixel-measured diamond bbox — x 12–488, y 20–544 of the 500×760 canvas). Switching to `contain` on the *original* lockup doesn't work either, for the opposite reason: `contain` never crops anything, so the wordmark stays in frame and the mark shrinks to a sliver inside the square box. The mismatch is the source's aspect ratio, not something reachable by choosing between `cover`/`contain` keywords on that source. `msig-mark.png` is a one-time square crop of just the diamond (same pixel bbox above, plus even margin) generated from `msig.webp` and checked into `assets/logos/` — `msig.webp` itself is untouched and still used anywhere the full lockup is wanted. If MSIG's source logo is ever replaced, regenerate `msig-mark.png` from the new file rather than hand-editing this one.

**Zywave's asset is the weakest of the three — don't assume all three source files are equivalent quality.** The original file shipped with this component was a 100×100 JPEG and was visibly softer than the other two at 2x/retina (confirmed via magnified side-by-side comparison, not eyeballed). It was replaced with a 200×200 version of the *same* mark sourced from zywave.com's own favicon — same design, genuinely sharper, now matches QuantivRisk's resolution class — but it's still a JPEG with a baked navy background (no transparency), and still not sourced from a dedicated brand/press-kit page (zywave.com has none; checked). If this logo is ever swapped again, verify the replacement at 40px on a real 2x viewport before shipping, the same way this one was — don't assume a larger source file is automatically an improvement without checking it rendered.

**Before pushing any change that touches the navbar, footer, head boilerplate, a case-study title, or a "Book a Strategy Call" CTA, run `node scripts/check-consistency.js`.** Node built-ins only, no dependencies, no build step, writes nothing, exits 1 if it finds anything. It replaced relying on a manual click-through/visual scan after that stopped being reliable — by the time a fourth page existed, drift had already gotten past review twice over: a client's title matched on 2 of 4 required instances and silently dropped a word ("Vehicle") on the rest, and an unsupported technical claim (an AWS SageMaker mention) had been cut from two of three duplicate copies of the same card description but missed on the third. Neither was caught by looking; both were caught by the next full audit. The script diffs the navbar/footer blocks across all four pages (normalizing the expected `../index.html#` vs `#` prefix so that expected difference doesn't itself get flagged), checks every client's `<title>`/`<h1>`/`<h3>`/`<p>` for exact match across every instance, resolves every `href`/`src` against the filesystem and every `#id` fragment against the actual target page's ids, and confirms every "Book a Strategy Call" CTA points at `#contact-name` (the name field, not the section — picked deliberately so the same button behaves the same way everywhere, see the commit that unified it). Output names the file, the element, and the two differing values — never just "mismatch found."

It hardcodes `PAGES` (the 4 files) and `CLIENT_PAGES` (which page owns which client's `<h1>`/`<title>`) on purpose, not by oversight — inferring either from DOM order or a file glob is exactly the kind of implicit assumption that lets drift back in unnoticed. **Extend both when a fifth page, or any new duplicated element, is added** — a page left out of `PAGES` is silently excluded from every check, not silently assumed correct.

**Checklist for adding a fourth page** — two more real bugs were hit building the first three, both structural, both will recur if skipped:
- Every heading (`<h1>`/`<h2>`) needs its own `.reveal` class, or a real ancestor with one. The sitewide stagger script wraps every `main h1, main h2`'s words in `.stagger-word` spans unconditionally; those spans only become visible via a `.reveal.is-visible` *ancestor* CSS rule. A heading sitting inside a `.reveal-group` (not `.reveal` itself — that class staggers a grid's *children*, it doesn't reveal the grid's own heading) renders permanently invisible, not just unanimated. This is exactly what happened to "More case studies" on the first page built.
- A paragraph immediately following a `<ul>` needs explicit top spacing, or it collapses flush against the list. The site's `p + p` rule only matches a paragraph after another paragraph. Already fixed at the component level (`.case-study__checklist` carries its own `margin-bottom`), so a new page only re-triggers this if it introduces a *different* list pattern that doesn't reuse that class.
- Wire up all four cross-link locations when a new page lands: its own two teaser links, the *other* pages' teaser links to it, and its homepage card's "Read the case study" link — then run the consistency script above rather than a visual scan. The MSIG→Zywave teaser link was missed this way once already (written before Zywave's page existed, never revisited once it did) and only surfaced as a Playwright timeout, not something inspection caught; the script's link-resolution check (§ above) now catches a missing or misdirected cross-link without needing a timeout to find it.

Also relevant if `script.js` changes: it's shared verbatim across all four pages, and two blocks (`#faq-list`, `#contact-form`) are guarded specifically because detail pages don't have those elements — see the guard commit. Any new top-level `document.getElementById(...)` added to that file needs the same check unless the element is guaranteed present on every page (navbar/footer elements are, since those are always duplicated in full).
