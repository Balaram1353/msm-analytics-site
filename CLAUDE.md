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

### Audit notes and judgment calls

- `--color-text` and `--color-ground-inverted` intentionally share the same hex (`#0b0f19`) — not a bug, just the brand navy doing two jobs (light-mode text, dark-mode background).
- `--color-ground-tint` looked like a near-duplicate of `--color-ground` by hex value alone, but it's the `.section--tint` alternating-band background used across 4 of 9 sections — a deliberate rhythm device, not drift. Kept.
- `--color-bg-elevated-2` (`#f1f5f9`, footer-only, single use, ~3-7 RGB points from `--color-ground`) had no comparable structural role — folded into `--color-ground`.
- 5 different white-alpha overlays on dark backgrounds (0.04 / 0.1 / 0.12 / 0.3 / 0.35) turned out to be 4 different real roles (card surface, chip/hover background, border, border-hover, decorative shine) rather than one role drifting — kept as 4 named tokens instead of forcing one value that would flatten a real state distinction (e.g. hover no longer visibly brightening).
- `--font-family-mono` (IBM Plex Mono) added per a competitive audit (`prototype/inspiration-board.md`) showing 7 of 11 surveyed data/AI sites use a dedicated mono face for numerals/eyebrows/labels. Scoped narrowly on purpose — mono is for data/metadata roles only, never body or headings, so it can't drift into a third display voice. Self-hosted like Inter/Space Grotesk, but static rather than variable (no variable build exists for this face): two weights only (600 SemiBold, 700 Bold — the only weights any mono-styled element actually uses), each subsetted to printable ASCII + en dash + curly apostrophe (`assets/fonts/ibm-plex-mono-{semibold,bold}.woff2`, ~4.6KB each vs ~140KB unsubsetted).
- `--font-size-h1`'s ceiling went to 72px, not the 88px the same audit's raw range suggested. The audit also warned that oversized hero type over thin proof reads as "style covering for missing substance" unless real proof (logos, stats, a headline metric) sits in or just below the hero — and none of that exists as a ready-to-place element on this site yet. 72px is the type-only move; 88px is conditional on a separate, later task that actually surfaces proof near the hero.
  - **Update: the condition has been met and 88px was declined anyway — don't relitigate without new information.** `.hero__proof` (see the hero) now sits directly below the hero CTAs: one measured figure (19–30% MAPE) linked to the specific case study that earned it. Compared side by side against 72px at 1440 and 390, 88px was not applied. Reason: the condition was written for *a* proof element near the hero, but one MAPE figure with no baseline to compare it against is still thin proof on its own — met technically, not in spirit. A single number without context is closer to a decoration than evidence; pushing the display type further on the strength of one unanchored figure would repeat the exact "style covering for missing substance" failure the 72px cap exists to avoid, just one number lighter than before. Revisit only if `.hero__proof` gains a second, comparable figure (a baseline, an industry benchmark, a before/after) — not by re-arguing the same one.
- `--font-size-mono-label` is a semantic alias for `--font-size-xs` (13px), not a new value — the mono-label role is distinct from general small text even though the number matches today.
- **Found and fixed: `.reveal` (and everything that copied its pattern) never actually animated.** `transition: opacity var(--transition-slow) var(--ease-out-expo), ...` combined a token that already bundled a timing function (`--transition-slow` was `400ms ease`) with an appended second one — invalid shorthand syntax, silently dropped by the browser to `all 0s ease 0s`. Confirmed via `getComputedStyle().transitionDuration === "0s"` and real `transitionstart`/`transitionend` event timestamps (identical start/end times, not 400ms apart) on `.reveal` itself, not just the new `.stagger-word` that copied it. Six declarations were affected sitewide: `.reveal`, `.stagger-word`, `.navbar__scrim` (both rules), the mobile nav panel's `grid-template-rows` transition, and `.faq__panel`'s — meaning the mobile menu's open/close and the FAQ accordion's expand/collapse have also been snapping instantly, not animating, since they were built. Fixed at the token level, not per call site: `--transition-fast/base/slow` now hold duration only (see their contract note above); every already-valid call site (the ~19 that used a token alone) is unaffected, since CSS defaults to `ease` when no timing-function is given. Invisible in every screenshot taken across this entire project, because a 0-duration change still looks "changed" in a still frame — only real event-timestamp instrumentation caught it.

## Known issues

- **Navbar CLS (~0.001, pre-existing, not caused by the ASCII field work). Re-tested after the transition-delay fix and the Space Grotesk preload shipped — still open, neither fix closes it.** Isolation re-run: 8 fresh cold-load contexts (no shared cache) per viewport, `PerformanceObserver({type:"layout-shift", buffered:true})` installed via an init script before any page JS runs, filtered to sources inside `.navbar__nav` / `.navbar__cta`. At 390px: 0/8 shifted — but that's structural, not fixed: `.navbar__cta` is `display:none` below 768px and `.navbar__nav` is `position:absolute` (out of normal flow) at that breakpoint, so neither can contribute to the flex row's box. At 1440px, where both sit as normal-flow siblings of `.navbar__logo` in `.navbar__inner` (`align-items: center`): 3/8 runs shifted, `navbar__nav` and `navbar__cta` moving together at the identical timestamp and identical value (0.00097) every time — one shared upstream cause, not two independent font swaps. The transition-delay fix is ruled out: none of the six declarations it touched (`.reveal`, `.stagger-word`, both `.navbar__scrim` rules, the mobile nav panel, `.faq__panel`) are `navbar__nav`, `navbar__cta`, or `navbar__logo`. The Space Grotesk preload is document-wide, so it does reach `.navbar__logo` (the one navbar element actually set in `--font-family-heading`) — plausible mechanism: `.navbar__logo`'s Space Grotesk swap changes its box, and `align-items: center` on the shared flex row drags its normal-flow siblings along, which is why the shift is attributed to `navbar__nav`/`navbar__cta` rather than the logo itself. That the preload reduced this from every load to 3/8 rather than 0/8 is consistent with the same "shrinks the swap window, doesn't close it" behavior documented for the hero below — but unlike the hero, there's no `fonts.ready` gate here to correct the remaining window, so 3/8 is expected to persist, not noise. Left open. Small enough to not fail a CLS budget on its own; do not bundle a fix into unrelated work.
- **Hero H1 word-stagger CLS: attribution corrected, not resolved.** Wrapping the hero H1's words in individual `.stagger-word` spans (per-word reveal) made an already-real reflow visible to CLS scoring for the first time — 6 of 8 cold 390px loads measured 0.054 (5.4x the 0.01 budget), traced via `PerformanceObserver` source attribution + `parentElement` chain to `hero > H1.hero__title`. Plain text reflow has no per-word element for the Layout Instability API to attribute a box-position change to, so the same underlying reflow was already happening pre-Step-4 and simply wasn't measurable — confirmed by disabling the word-wrapping entirely on disk (not just via CSS override) and reproducing the pre-existing ~0.00004 baseline exactly. The `document.fonts.ready` gate in `script.js` (word-wrapping doesn't run until the real font has settled, 2s safety-timeout fallback) makes this **attribution correction**, not a fix: 16/16 runs (8 cold-390, 4 warm-390, 4 cold-1440) back at baseline after the gate, but the gate only controls *when the CLS-sensitive span structure exists relative to the swap* — it does nothing to the swap itself.
- **Space Grotesk preload: reflow reduced, separately from the above.** `index.html` preloads only `space-grotesk-variable.woff2` (the one display face used above the fold — not Inter, not IBM Plex Mono, to avoid early-bandwidth competition). Verified via direct geometric probing (a `Range`/span rect check on the word "can" in the hero H1, independent of CLS scoring): without preload, a genuine line-change reflow (different `left`, ~44px `top` delta — not the animation's own 8px `translateY`) reproduced in 1 of 6 cold runs; with preload, 0 of 10. This is a different claim from the gate above — the gate hides the reflow from CLS if it still happens after reveal; the preload actually shrinks the swap window that causes it. Both are real, independent effects; neither substitutes for the other.
- **About's "By the numbers" stats: better home is likely the end of Case Studies, not About. Logged, not scheduled.** The three stats (`.about__stats`) are section 7 of 10, sitting next to the founding-story bio. The 19–30% MAPE figure among them is the exact number the Zywave case study (section 6, directly above) earns — About is currently just restating a number Case Studies already substantiated, in a section that's otherwise mission/bio content with no other numeric claims. Closing out Case Studies with the same stat band would put the numbers next to the evidence that makes them credible instead of next to a paragraph about company philosophy — a section-identity fix, not a depth fix (moving section 7 content to the end of section 6 doesn't meaningfully change how many sections a visitor scrolls through first). Distinct from, and doesn't substitute for, `.hero__proof`'s job of surfacing one number early for visitors who never reach section 6 at all.
