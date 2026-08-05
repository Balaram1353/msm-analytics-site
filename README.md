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
│   └── script.js          Nav menu, scroll-reveal, FAQ accordion,
│                           form validation, scroll-spy, footer year
│
├── assets/
│   └── video/             Hero background video — see "Hero background
│                           video" below for source/license
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

## Hero background video

The hero section's background is a real downloaded video, not a hotlinked
URL or a CSS/canvas effect:

- **Clip**: "Flowing Blue Lights in Motion"
- **Source**: [Mixkit](https://mixkit.co/free-stock-video/flowing-blue-lights-in-motion-101442/)
- **Author**: not individually credited on Mixkit (platform-published clip)
- **License**: [Mixkit Stock Video Free License](https://mixkit.co/license/#videoFree)
  — free for commercial and personal use; attribution not required, but
  appreciated
- **Files**: downloaded at 1920×1080 and re-encoded locally —
  `assets/video/hero-bg.mp4` (H.264, ~2.2MB), `assets/video/hero-bg.webm`
  (VP9, ~1.2MB, served first to browsers that support it), and
  `assets/video/hero-poster.jpg` (first frame, ~26KB) as the poster/fallback
  image

`js/script.js` only attaches `<source>` elements to the `<video>` (and
therefore only lets the browser request the video file) when the visitor
hasn't asked for reduced motion and doesn't appear to be on a slow or
data-saver connection (`navigator.connection.saveData` /
`effectiveType`). In every other case — including if the video ever
errors — the `poster` image is what actually renders, since a `<video>`
with no attached source never issues a network request in the first
place.

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
