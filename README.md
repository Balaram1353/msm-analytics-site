# MSM Analytics — Website

A single-page marketing site for MSM Analytics (an AI & Data Science
consultancy), built as a learning project in **plain HTML5, CSS3, and
vanilla JavaScript** — no frameworks, no build step, no dependencies.

Layout/UX inspired by the structure of [Consultia](https://consultia.framer.ai/)
(a Framer template); all copy, icons, graphics, and visual identity here are
original.

---

## Running it locally

No build step, no `npm install` — just open `index.html` in a browser.

- **Simplest**: double-click `index.html`, or drag it into a browser window.
- **Recommended**: serve it through a local server instead of opening it
  directly as a `file://` URL. This isn't strictly required today, but it's
  the safer habit — the moment you add something that fetches another file
  (a real font, a JSON file, a future API call), `file://` will silently
  fail due to browser CORS restrictions, and a local server won't.
  - VS Code: install the **Live Server** extension, right-click
    `index.html` → "Open with Live Server."
  - Or, if you have Node installed: `npx serve .` from this folder.

There is **no backend**. The contact form validates client-side and shows a
placeholder success message — it doesn't send anywhere yet (see "Wiring up
the contact form" below).

---

## Folder structure

```
├── index.html            One page, all sections, clearly commented
│
├── css/
│   ├── reset.css          Neutralizes browser default styling
│   ├── variables.css       Design tokens — colors, spacing, type, shadows
│   ├── style.css           Base styles + every section's CSS
│   └── responsive.css      All @media breakpoint overrides
│
├── js/
│   └── script.js          Nav menu, scroll-reveal, FAQ accordion, hero
│                           canvas animation, form validation, scroll-spy,
│                           footer year
│
├── assets/
│   └── fonts/             Self-hosted webfonts (see "Customizing" below)
│
├── images/  icons/            Reserved for real assets (currently empty —
│                               see "What's still a placeholder" below)
│
└── README.md              This file
```

**Why the CSS is split this way**: `variables.css` is the one file you'd
hand a designer to reskin the whole site — every color, spacing value, and
font size used anywhere is defined there once, as a CSS custom property,
and referenced everywhere else via `var(--token-name)`. `reset.css` and
`responsive.css` are separated out because they're conceptually different
jobs (neutralizing defaults vs. adding breakpoint overrides), not because
the site is large enough to need it yet.

---

## Customizing

### Colors, spacing, type — `css/variables.css`
Everything visual traces back to a `:root` custom property in this one
file. Change `--color-accent` and every button, link, and highlight on the
site updates. There's no theme toggle currently — it's a light theme only
(see the plan discussion this was built against for why).

### Copy
All text lives directly in `index.html`, in clearly commented section
blocks (`<!-- ==== HERO ==== -->`, etc.). Every section is a self-contained,
copy-paste-swappable block — you can replace the text inside one section
without needing to understand any other section.

### The booking CTA
Every "Book a Strategy Call" button currently points to `#contact` (it just
scrolls down the page) and is marked with an HTML comment:
```html
<!-- TODO: replace with real Calendly URL once available -->
```
Search `index.html` for `TODO` to find all of them — swap the `href` for a
real Calendly (or other scheduling) link.

### Social links & email
`.footer__social-link` hrefs are currently `#` placeholders (also marked
`TODO`) — update with real LinkedIn/X profile URLs. The email address
(`hello@msmanalytics.com`, in the footer) is also a placeholder — update the
`mailto:` link once you have a real inbox for it.

---

## Hero background animation

The hero section's background is a `<canvas>` animation drawn entirely in
`js/script.js` — no image or video asset involved. It loops through four
phases (roughly 12–16 seconds, varying slightly each cycle):

- **Scattered** — faint points drift slowly at random.
- **Resolving** — points ease onto a smooth, upward-trending curve
  (eased, staggered per point so they don't all land at once).
- **Resolved** — a line strokes through the points with a soft gradient
  fill beneath.
- **Dissolving** — the line/fill fade out and points ease back to new
  random positions before the curve regenerates and the loop repeats.

Colors come from `--color-accent` / `--color-accent-secondary` in
`css/variables.css` via `getComputedStyle`, not hardcoded hex values, so
a palette change there carries through automatically. Density is
weighted away from the left column where the headline and CTAs sit.

`prefers-reduced-motion: reduce` renders a single static resolved frame
and never starts the animation loop at all — the motion is the part
that needs consent, not the presence of the curve itself. The loop also
pauses via the Page Visibility API whenever the tab is backgrounded, and
the resize handler is debounced.

## What's still a placeholder (built for easy swapping)

- **About photo**: a labeled placeholder box, not a real image. Written as
  a `<div>` specifically so it's easy to find and replace — search
  `index.html` for `Founder Photo` and swap that block for a real
  `<img src="..." alt="[Name], Founder of MSM Analytics">`. Once you do,
  add `loading="lazy"` to it (and to any other image you add below the
  fold) — there are currently zero real `<img>` tags on the page, so this
  wasn't applicable yet, but it matters once real photos go in.
- **Testimonial**: placeholder quote and attribution in the About section.
- **FAQ answers, service descriptions, benefit copy**: all realistic
  placeholder copy — written to match the intended tone, but not final.
- **Favicon**: currently a simple inline SVG (a blue square with "M"),
  generated as a data URI directly in `index.html`'s `<head>` — swap for a
  real favicon file when you have brand assets.

## Wiring up the contact form

`js/script.js`'s submit handler currently does this on a valid submission:
```js
contactSuccess.hidden = false;
contactForm.reset();
```
To connect it to a real backend, replace that block with a `fetch()` call
to whatever service you choose (a serverless function, Formspree, etc.),
and move the success-message logic into that request's `.then()` — showing
an error state in the `.catch()` if it fails. Everything else (validation,
error display, accessibility wiring) stays as-is.

---

## Browser support notes

Built with modern CSS (`clamp()`, CSS Grid, `aspect-ratio`,
`grid-template-rows` height transitions, `:focus-visible`) and modern JS
(`IntersectionObserver`, `closest()`). This covers all current-generation
browsers (Chrome, Firefox, Safari, Edge) but does **not** target Internet
Explorer or very old browser versions — not a concern for a new site today,
but worth knowing if that ever changes.
