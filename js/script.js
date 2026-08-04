/* ==========================================================================
   SCRIPT.JS — Site Behavior
   ==========================================================================
   This file will hold, as we build each section:
     - Step 1:  Mobile nav toggle + sticky navbar scroll state
     - Step 11: Scroll-reveal animations (IntersectionObserver)
     - Step 8:  FAQ accordion interactions
     - Step 9:  Contact form client-side validation

   Kept as a single file deliberately (see Phase 3 of the plan) — this
   project is small enough that splitting into multiple JS files would
   add script-ordering complexity without a real benefit. Everything
   runs after the DOM is parsed because the <script> tag is placed at
   the end of <body> in index.html (rather than using a DOMContentLoaded
   listener) — a simple, dependency-free way to guarantee elements exist
   before we query for them.
   ========================================================================== */

/* ==========================================================================
   NAVBAR — scroll state + mobile menu
   ========================================================================== */

const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navbar-toggle");
const navMenu = document.getElementById("navbar-nav");

/* --- Solid background once the user scrolls past a small threshold ---
   We read scroll position on every "scroll" event, which can fire dozens
   of times per second. Doing real work (reading/writing layout) on every
   single one of those events can visibly jank the page. requestAnimationFrame
   batches our update to run once per rendered frame at most, no matter how
   many scroll events fired in between — the standard technique for
   scroll-driven UI changes. `ticking` just prevents queuing more than one
   rAF callback at a time. */
let ticking = false;

function updateNavbarBackground() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateNavbarBackground);
    ticking = true;
  }
});

/* --- Mobile menu toggle --- */

/* The closed dropdown is only hidden VISUALLY by CSS (max-height: 0 +
   overflow: hidden) — that alone does NOT remove its links from tab
   order or from the accessibility tree. Without this, a keyboard user
   tabbing from the logo lands on 6 invisible, zero-height links before
   ever reaching the CTA/hamburger, and screen readers announce them
   too, out of context. `inert` fixes both at once (unfocusable, not
   exposed to AT) — but only while we're actually in the collapsed
   mobile layout; at 980px+ the nav is always visible and must stay
   fully interactive, so we track that breakpoint here too. */
const desktopNavQuery = window.matchMedia("(min-width: 980px)");

function syncNavInert() {
  const isCollapsedLayout = !desktopNavQuery.matches;
  const isClosed = !navMenu.classList.contains("is-open");
  navMenu.inert = isCollapsedLayout && isClosed;
}

function openMobileMenu() {
  navMenu.classList.add("is-open");
  navToggle.classList.add("is-active");
  navToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
  // Forces the same glass background the scrolled state uses, even at
  // scrollY 0 — otherwise the solid dropdown panel appears to float
  // below a still-fully-transparent bar with nothing visually anchoring
  // it to a header.
  navbar.classList.add("is-menu-open");
  syncNavInert();
}

function closeMobileMenu() {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-active");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("no-scroll");
  navbar.classList.remove("is-menu-open");
  syncNavInert();
}

desktopNavQuery.addEventListener("change", syncNavInert);
syncNavInert();

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("is-open");
  isOpen ? closeMobileMenu() : openMobileMenu();
});

/* Close the menu when a nav link is clicked. We attach ONE listener to
   the menu container and check what was actually clicked (event
   delegation), rather than looping over every <a> and attaching a
   listener to each — fewer listeners, and it keeps working automatically
   if links are ever added/removed from the markup later. */
navMenu.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    closeMobileMenu();
  }
});

/* Close on click outside the navbar entirely. */
document.addEventListener("click", (event) => {
  const isOpen = navMenu.classList.contains("is-open");
  const clickedInsideNavbar = navbar.contains(event.target);
  if (isOpen && !clickedInsideNavbar) {
    closeMobileMenu();
  }
});

/* Close on Escape — standard expected behavior for any dismissible menu/dialog. */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
    closeMobileMenu();
  }
});

/* --------------------------------------------------------------------
   SCROLL-SPY — highlight whichever nav link matches the section
   currently in view.
   --------------------------------------------------------------------
   Builds a Map from section id -> its matching <a>, by reading the
   nav links' own href values rather than hardcoding a list of ids —
   so if a link is ever added or removed from the markup, this code
   doesn't need to change at all.
   -------------------------------------------------------------------- */

const navLinksBySectionId = new Map();
document.querySelectorAll(".navbar__link").forEach((link) => {
  const sectionId = link.getAttribute("href").slice(1); // "#faq" -> "faq"
  navLinksBySectionId.set(sectionId, link);
});

// Read the navbar height from CSS rather than hardcoding it again here —
// if --navbar-height ever changes in variables.css, this stays correct
// automatically instead of silently drifting out of sync.
const navbarHeightPx = parseInt(
  getComputedStyle(document.documentElement).getPropertyValue("--navbar-height"),
  10
);

const scrollSpyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinksBySectionId.get(entry.target.id);
      if (!link || !entry.isIntersecting) return;

      navLinksBySectionId.forEach((otherLink) => otherLink.classList.remove("is-active"));
      link.classList.add("is-active");
    });
  },
  {
    // Shrinks the "trigger zone" to a thin horizontal band starting
    // just below the fixed navbar: a section only counts as "current"
    // once it's within the top ~40% of the viewport, not simply
    // whenever any part of it is visible on screen.
    rootMargin: `-${navbarHeightPx + 10}px 0px -60% 0px`,
    threshold: 0,
  }
);

navLinksBySectionId.forEach((_link, sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) scrollSpyObserver.observe(section);
});

/* ==========================================================================
   SCROLL REVEAL — shared IntersectionObserver engine
   ==========================================================================
   Any element with class="reveal" (added throughout the rest of this
   build) fades/slides into view the first time it enters the viewport.

   Why IntersectionObserver instead of a "scroll" listener that checks
   every element's position: IntersectionObserver is handled by the
   browser off the main thread — it doesn't run our code on every scroll
   frame at all, only when an observed element's visibility actually
   changes. That makes it both simpler to write and cheaper to run than
   manually comparing getBoundingClientRect() on every scroll event.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  // Skip the animation entirely — just show everything immediately.
  revealElements.forEach((el) => el.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Reveal is a one-time entrance animation, not something that
          // should replay every time the user scrolls back up past it —
          // so we stop watching it once it's been revealed.
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15, // fire once 15% of the element is visible
      rootMargin: "0px 0px -40px 0px", // trigger slightly before it's fully in view
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   FAQ ACCORDION
   ==========================================================================
   One click listener on the shared container (event delegation) instead
   of five separate listeners — one per button. This also means the
   logic keeps working unmodified even if FAQ items are added or removed
   from the markup later.
   ========================================================================== */

const faqList = document.getElementById("faq-list");

faqList.addEventListener("click", (event) => {
  // event.target is whatever element was actually clicked — which could
  // be the <button>, or the <span> or <svg> inside it. .closest() walks
  // up from there to find the nearest ".faq__trigger" ancestor (or the
  // element itself if it already matches), so the handler works no
  // matter which inner element the click technically landed on.
  const trigger = event.target.closest(".faq__trigger");
  if (!trigger) return; // click was on the container but not a question

  const item = trigger.closest(".faq__item");
  const isCurrentlyOpen = item.classList.contains("is-open");

  item.classList.toggle("is-open", !isCurrentlyOpen);
  trigger.setAttribute("aria-expanded", String(!isCurrentlyOpen));
});

/* ==========================================================================
   CONTACT FORM — client-side validation
   ==========================================================================
   The form has novalidate (see index.html), which turns OFF the browser's
   own validation popups — but the underlying validation ENGINE is still
   there and still usable programmatically via field.validity and
   field.checkValidity(). We're only replacing the browser's default UI
   for showing errors, not reimplementing "is this a valid email" from
   scratch with a hand-rolled regular expression.
   ========================================================================== */

const contactForm = document.getElementById("contact-form");
const contactSuccess = document.getElementById("contact-success");

// Only the fields that actually have validation rules (required, or
// type="email") — Job Title and Company are intentionally excluded,
// since they're optional and never need an error state.
const validatedFields = contactForm.querySelectorAll(
  "#contact-name, #contact-email, #contact-message"
);

function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    return field.dataset.errorRequired;
  }
  if (field.validity.typeMismatch) {
    return field.dataset.errorType;
  }
  return "";
}

function validateField(field) {
  const errorEl = document.getElementById(field.getAttribute("aria-describedby"));
  const isValid = field.checkValidity();

  field.classList.toggle("is-invalid", !isValid);
  if (isValid) {
    field.removeAttribute("aria-invalid");
  } else {
    field.setAttribute("aria-invalid", "true");
  }
  if (errorEl) {
    errorEl.textContent = isValid ? "" : getErrorMessage(field);
  }

  return isValid;
}

validatedFields.forEach((field) => {
  // Errors first appear on blur (leaving the field) — not while the
  // user is still in the middle of typing into it for the first time.
  field.addEventListener("blur", () => validateField(field));

  // Once a field IS showing an error, re-validate on every keystroke so
  // the error can clear the moment it's fixed — this only re-runs
  // validation for fields already marked invalid, so it never makes an
  // untouched field show an error just because the user typed elsewhere.
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid")) {
      validateField(field);
    }
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault(); // no backend yet — see the plan's assumptions

  let isFormValid = true;
  let firstInvalidField = null;

  validatedFields.forEach((field) => {
    const fieldIsValid = validateField(field);
    if (!fieldIsValid) {
      isFormValid = false;
      firstInvalidField = firstInvalidField || field;
    }
  });

  if (!isFormValid) {
    firstInvalidField.focus();
    return;
  }

  contactSuccess.hidden = false;
  contactForm.reset();
  // .reset() clears field VALUES but not our own .is-invalid classes or
  // error text from any prior failed attempt — clear those explicitly
  // so a fresh form doesn't still show old error messages.
  validatedFields.forEach((field) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    const errorEl = document.getElementById(field.getAttribute("aria-describedby"));
    if (errorEl) errorEl.textContent = "";
  });
});

/* ==========================================================================
   FOOTER — copyright year
   ==========================================================================
   Reads the current year at load time instead of a hardcoded number —
   a hardcoded year is the kind of thing that quietly goes stale on a
   live site and nobody notices for months. */
document.getElementById("footer-year").textContent = new Date().getFullYear();

/* ==========================================================================
   HERO — cursor spotlight
   ==========================================================================
   A soft glow that follows the cursor around the hero section — purely
   visual, reads --spot-x/--spot-y back out in the .hero::before
   radial-gradient in style.css. Gated behind the same checks the CSS
   itself uses (a real mouse present, no reduced-motion preference) so
   this doesn't run pointless work on touch devices.
   ========================================================================== */

const supportsHover = window.matchMedia("(hover: hover)").matches;

if (!prefersReducedMotion) {
  const heroSection = document.getElementById("hero");

  if (heroSection && supportsHover) {
    let spotlightQueued = false;

    heroSection.addEventListener("pointermove", (event) => {
      if (spotlightQueued) return;
      spotlightQueued = true;

      requestAnimationFrame(() => {
        const rect = heroSection.getBoundingClientRect();
        const xPct = ((event.clientX - rect.left) / rect.width) * 100;
        const yPct = ((event.clientY - rect.top) / rect.height) * 100;
        heroSection.style.setProperty("--spot-x", `${xPct}%`);
        heroSection.style.setProperty("--spot-y", `${yPct}%`);
        spotlightQueued = false;
      });
    });
  }
}

/* ==========================================================================
   HERO — scatter-to-trend canvas animation
   ==========================================================================
   Ambient background behind the hero copy, drawn entirely on <canvas> —
   no image or video asset. A continuous ~12-16s loop through four phases:

     scattered  — points drift slowly at random, faint, no line.
     resolving  — points ease (eased, staggered per-point) onto a smooth
                  upward-trending curve.
     resolved   — points hold on the curve; a stroked line + soft gradient
                  fill render through them.
     dissolving — line/fill fade out, points ease back to new random
                  drift positions, then the loop repeats with a freshly
                  regenerated curve.

   Colors are read from the CSS custom properties (--color-accent /
   --color-accent-secondary) via getComputedStyle rather than hardcoded,
   so a palette change in variables.css carries through automatically.

   Performance: no pairwise (O(n^2)) distance checks anywhere — unlike a
   particle-link network, this design only ever draws ONE path through
   the points (in curve order) plus one gradient fill and n small dot
   fills per frame, so the whole update+draw pass is O(n) regardless of
   point count.
   ========================================================================== */

(function initHeroCanvas() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const heroSection = document.getElementById("hero");

  const styles = getComputedStyle(document.documentElement);
  const accent = styles.getPropertyValue("--color-accent").trim() || "#3b82f6";
  const accentSecondary =
    styles.getPropertyValue("--color-accent-secondary").trim() || "#0d9488";

  // Everything this animation draws is capped at this alpha — it sits
  // behind an H1 people need to read.
  const MAX_ALPHA = 0.18;

  const PHASE_DURATIONS_BASE = {
    scattered: 4000,
    resolving: 3000,
    resolved: 3000,
    dissolving: 3000,
  };
  const PHASE_ORDER = ["scattered", "resolving", "resolved", "dissolving"];

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  let points = [];
  let curveControlPoints = null;
  let phase = "scattered";
  let phaseStart = performance.now();
  let phaseDurations = { ...PHASE_DURATIONS_BASE };
  let hiddenAt = null;
  let rafId = null;
  let contentBox = null;
  let layoutRegion = null;

  // Measures where .hero__content actually sits (in canvas-local, CSS
  // pixel coordinates) so the animation can avoid it — rather than
  // assuming it lives in a fixed fraction of the canvas width, which
  // breaks down the moment the copy spans the full width at narrow
  // viewports.
  function computeContentBox() {
    const contentEl = heroSection.querySelector(".hero__content");
    if (!contentEl) {
      contentBox = null;
      return;
    }
    const heroRect = heroSection.getBoundingClientRect();
    const rect = contentEl.getBoundingClientRect();
    contentBox = {
      left: rect.left - heroRect.left,
      top: rect.top - heroRect.top,
      right: rect.right - heroRect.left,
      bottom: rect.bottom - heroRect.top,
    };
  }

  // Picks the rectangle the animation is allowed to live in: beside the
  // copy when there's real room there (desktop/tablet), or below it when
  // there isn't (the copy spans the full width at narrow viewports) —
  // so the curve and scattered points never render on top of the
  // headline/body text regardless of layout.
  function computeLayoutRegion() {
    const margin = 24;
    if (!contentBox) {
      layoutRegion = { x0: width * 0.1, y0: height * 0.12, x1: width * 0.92, y1: height * 0.88 };
      return;
    }
    const spaceRight = width - contentBox.right;
    const spaceBelow = height - contentBox.bottom;
    if (spaceRight > 200) {
      layoutRegion = {
        x0: contentBox.right + margin,
        y0: height * 0.12,
        x1: width - margin,
        y1: height * 0.88,
      };
    } else {
      const bandTop = contentBox.bottom + margin;
      layoutRegion = {
        x0: margin,
        y0: bandTop,
        x1: width - margin,
        y1: Math.max(bandTop + 60, height - 16),
      };
    }
  }

  // x is weighted toward the far end of the available region (exponent
  // skews the [0,1) random sample toward 1) so density stays low right
  // at the region's near edge — i.e. closest to the copy.
  function randomRegionPoint() {
    const useBiased = Math.random() < 0.8;
    const xFrac = useBiased ? 1 - Math.pow(Math.random(), 1.8) : Math.random();
    const x = layoutRegion.x0 + xFrac * (layoutRegion.x1 - layoutRegion.x0);
    const y = layoutRegion.y0 + Math.random() * (layoutRegion.y1 - layoutRegion.y0);
    return { x, y };
  }

  function pointCountForArea(w, h) {
    let count = Math.round((w * h) / 22000);
    count = Math.max(18, Math.min(70, count));
    if (w < 480) {
      count = Math.max(10, Math.round(count * 0.5));
    }
    return count;
  }

  function randomizePhaseDurations() {
    // Scales each phase by the same random factor so the ~4:3:3:3 ratio
    // holds while the total cycle length varies (~12-16s) cycle to
    // cycle, so the loop never feels perfectly metronomic.
    const scale = 0.92 + Math.random() * 0.32;
    phaseDurations = {
      scattered: PHASE_DURATIONS_BASE.scattered * scale,
      resolving: PHASE_DURATIONS_BASE.resolving * scale,
      resolved: PHASE_DURATIONS_BASE.resolved * scale,
      dissolving: PHASE_DURATIONS_BASE.dissolving * scale,
    };
  }

  // Regenerates the ascending trend curve (4 cubic-bezier control points,
  // left-to-right, y decreasing = trending up) with fresh random jitter,
  // confined to layoutRegion — beside the copy or below it, whichever is
  // actually free (see computeLayoutRegion).
  function regenerateCurve() {
    const regionW = layoutRegion.x1 - layoutRegion.x0;
    const regionH = layoutRegion.y1 - layoutRegion.y0;
    const leftX = layoutRegion.x0 + regionW * Math.random() * 0.08;
    const rightX = layoutRegion.x1 - regionW * Math.random() * 0.06;
    const baseY = layoutRegion.y1 - regionH * Math.random() * 0.08;
    const topY = layoutRegion.y0 + regionH * Math.random() * 0.1;

    curveControlPoints = [
      { x: leftX, y: baseY },
      {
        x: lerp(leftX, rightX, 0.35 + (Math.random() - 0.5) * 0.15),
        y: lerp(baseY, topY, 0.25 + (Math.random() - 0.5) * 0.2),
      },
      {
        x: lerp(leftX, rightX, 0.7 + (Math.random() - 0.5) * 0.15),
        y: lerp(baseY, topY, 0.7 + (Math.random() - 0.5) * 0.2),
      },
      { x: rightX, y: topY },
    ];
  }

  function curvePoint(t) {
    const [p0, p1, p2, p3] = curveControlPoints;
    const mt = 1 - t;
    const x =
      mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x;
    const y =
      mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y;
    return { x, y };
  }

  function randomDriftTarget(p) {
    p.driftVX = (Math.random() - 0.5) * 6;
    p.driftVY = (Math.random() - 0.5) * 6;
  }

  function createPoint() {
    const { x, y } = randomRegionPoint();
    const p = {
      x,
      y,
      driftVX: 0,
      driftVY: 0,
      originX: x,
      originY: y,
      targetX: x,
      targetY: y,
      stagger: Math.random() * 0.3,
      radius: 1.2 + Math.random() * 1.3,
      jitter: (Math.random() - 0.5) * 10,
    };
    randomDriftTarget(p);
    return p;
  }

  function buildPoints() {
    const count = pointCountForArea(width, height);
    points = Array.from({ length: count }, createPoint);
  }

  function assignCurveTargets() {
    const ordered = [...points].sort((a, b) => a.x - b.x);
    ordered.forEach((p, i) => {
      const t = ordered.length === 1 ? 0.5 : i / (ordered.length - 1);
      const curveXY = curvePoint(t);
      p.targetX = curveXY.x + p.jitter;
      p.targetY = curveXY.y + p.jitter * 0.4;
      p.stagger = Math.random() * 0.3;
    });
  }

  function beginResolving() {
    points.forEach((p) => {
      p.originX = p.x;
      p.originY = p.y;
    });
    regenerateCurve();
    assignCurveTargets();
  }

  function beginDissolving() {
    points.forEach((p) => {
      p.originX = p.x;
      p.originY = p.y;
      const target = randomRegionPoint();
      p.targetX = target.x;
      p.targetY = target.y;
      p.stagger = Math.random() * 0.3;
    });
  }

  function completeDissolve() {
    points.forEach((p) => {
      p.x = p.targetX;
      p.y = p.targetY;
      randomDriftTarget(p);
    });
    randomizePhaseDurations();
  }

  function updatePhase(now) {
    const elapsed = now - phaseStart;
    if (elapsed < phaseDurations[phase]) return;

    const currentIndex = PHASE_ORDER.indexOf(phase);
    const nextPhase = PHASE_ORDER[(currentIndex + 1) % PHASE_ORDER.length];
    phaseStart = now;
    phase = nextPhase;

    if (phase === "resolving") beginResolving();
    else if (phase === "dissolving") beginDissolving();
    else if (phase === "scattered") completeDissolve();
  }

  function updatePoints(now, dt) {
    const raw = Math.min(1, (now - phaseStart) / phaseDurations[phase]);

    if (phase === "resolving" || phase === "dissolving") {
      points.forEach((p) => {
        const local = Math.max(0, Math.min(1, (raw - p.stagger) / (1 - p.stagger || 1)));
        const eased = easeInOutCubic(local);
        p.x = lerp(p.originX, p.targetX, eased);
        p.y = lerp(p.originY, p.targetY, eased);
      });
    } else if (phase === "scattered") {
      // Bounded by layoutRegion, not the raw canvas — otherwise a point
      // could drift out of the free space and over the copy over the
      // course of a long scattered phase.
      const { x0, y0, x1, y1 } = layoutRegion;
      points.forEach((p) => {
        p.x += p.driftVX * dt;
        p.y += p.driftVY * dt;
        if (p.x < x0 || p.x > x1) p.driftVX *= -1;
        if (p.y < y0 || p.y > y1) p.driftVY *= -1;
        p.x = Math.max(x0, Math.min(x1, p.x));
        p.y = Math.max(y0, Math.min(y1, p.y));
      });
    }
    // "resolved" phase: points hold their curve position, no update needed.

    return raw;
  }

  function lineFillAlpha(raw) {
    if (phase === "scattered") return 0;
    if (phase === "resolving") return MAX_ALPHA * easeInOutCubic(raw);
    if (phase === "resolved") return MAX_ALPHA;
    if (phase === "dissolving") return MAX_ALPHA * (1 - easeInOutCubic(raw));
    return 0;
  }

  function pointAlpha(raw) {
    const base = 0.08;
    const peak = 0.16;
    if (phase === "scattered") return base;
    if (phase === "resolving") return lerp(base, peak, easeInOutCubic(raw));
    if (phase === "resolved") return peak;
    if (phase === "dissolving") return lerp(peak, base, easeInOutCubic(raw));
    return base;
  }

  function draw(raw) {
    ctx.clearRect(0, 0, width, height);

    const lfAlpha = lineFillAlpha(raw);
    if (lfAlpha > 0.002) {
      const ordered = [...points].sort((a, b) => a.x - b.x);
      const baselineY = Math.min(height - 4, layoutRegion.y1 + 20);

      ctx.beginPath();
      ordered.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      const gradient = ctx.createLinearGradient(0, layoutRegion.y0, 0, baselineY);
      gradient.addColorStop(0, hexToRgba(accent, lfAlpha * 0.55));
      gradient.addColorStop(1, hexToRgba(accent, 0));

      // Fill: continue the same path down to a baseline and back before
      // filling, so the stroke above stays a clean single line.
      const fillPath = new Path2D();
      ordered.forEach((p, i) => {
        if (i === 0) fillPath.moveTo(p.x, p.y);
        else fillPath.lineTo(p.x, p.y);
      });
      fillPath.lineTo(ordered[ordered.length - 1].x, baselineY);
      fillPath.lineTo(ordered[0].x, baselineY);
      fillPath.closePath();
      ctx.fillStyle = gradient;
      ctx.fill(fillPath);

      ctx.strokeStyle = hexToRgba(accentSecondary, lfAlpha);
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
    }

    const pAlpha = pointAlpha(raw);
    ctx.fillStyle = hexToRgba(accent, pAlpha);
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Colors in variables.css are plain hex (#3b82f6) — this only needs to
  // support that one format, not a general-purpose color parser.
  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function resizeCanvas() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeContentBox();
    computeLayoutRegion();
    buildPoints();
    if (phase === "resolving" || phase === "resolved" || phase === "dissolving") {
      regenerateCurve();
      assignCurveTargets();
    }
  }

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 180);
  }

  let lastFrameTime = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
    lastFrameTime = now;
    updatePhase(now);
    const raw = updatePoints(now, dt);
    draw(raw);
    rafId = requestAnimationFrame(tick);
  }

  function drawStaticReducedMotionFrame() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeContentBox();
    computeLayoutRegion();
    buildPoints();
    regenerateCurve();
    assignCurveTargets();
    points.forEach((p) => {
      p.x = p.targetX;
      p.y = p.targetY;
    });
    // draw()'s alpha functions branch on `phase` — force it to "resolved"
    // so the static frame actually shows the full-strength line + fill,
    // not the (default) faint scattered-phase look.
    phase = "resolved";
    draw(1);
  }

  if (prefersReducedMotion) {
    // A still resolved frame is a fine background on its own — the RAF
    // loop (and the resize/visibility listeners it would need) never
    // starts at all, since the motion itself is what needs consent.
    drawStaticReducedMotionFrame();
    return;
  }

  resizeCanvas();
  window.addEventListener("resize", onResize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      hiddenAt = performance.now();
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      if (hiddenAt !== null) {
        // Shift the phase clock forward by however long the tab was
        // hidden, so the paused time doesn't count as elapsed animation
        // time and the phase doesn't jump ahead on return.
        const hiddenDuration = performance.now() - hiddenAt;
        phaseStart += hiddenDuration;
        hiddenAt = null;
      }
      lastFrameTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  });

  rafId = requestAnimationFrame(tick);
})();

/* ==========================================================================
   ANIMATED STAT COUNTERS
   ==========================================================================
   Any element with class="js-counter" counts up from 0 to its own final
   value the first time it scrolls into view, instead of just appearing.
   Deliberately generic rather than hardcoded per-element: it parses
   each element's OWN existing text (e.g. "+42%", "19–30%", "100%") into
   a leading sign, a leading number, and whatever text follows — so the
   exact same function drives every stat on the page, and the markup
   stays the single source of truth for the real values (nothing is
   duplicated into a data-* attribute that could drift out of sync).
   ========================================================================== */

function animateCounter(el) {
  const finalText = el.textContent.trim();
  // Leading optional sign, leading number (integer or decimal), then
  // whatever's left (%, a unit, an en-dash + second number, etc.) is
  // kept as a static suffix — only the FIRST number in the string ever
  // animates. For "19–30%" this counts 0 -> 19 while "–30%" sits there
  // unchanged the whole time, landing on the exact original text.
  const match = finalText.match(/^([+\-]?)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return; // no leading number (shouldn't happen for .js-counter) — leave as-is

  const [, sign, numberText, suffix] = match;
  const targetValue = parseFloat(numberText);
  const isDecimal = numberText.includes(".");
  const duration = 1400;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const currentValue = targetValue * eased;

    el.textContent = `${sign}${isDecimal ? currentValue.toFixed(1) : Math.round(currentValue)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Land on the exact original string — guards against any float
      // rounding drift (e.g. "19.999999...") ever being left on screen.
      el.textContent = finalText;
    }
  }

  requestAnimationFrame(tick);
}

const counterElements = document.querySelectorAll(".js-counter");

if (!prefersReducedMotion && counterElements.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}
