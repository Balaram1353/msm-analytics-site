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
   HERO — background video, loaded conditionally
   ==========================================================================
   The <video> in index.html has autoplay/muted/loop/playsinline plus a
   poster, but deliberately NO <source> children in the markup. A <video>
   with no playable source never issues a network request no matter what
   its other attributes say — so "don't load the video" just means "never
   append a <source>," and the poster attribute keeps rendering on its
   own as a static image for as long as that's true. That covers two of
   the required fallbacks with no extra code:
     - prefers-reduced-motion: reduce -> sources never attached, poster
       is the permanent background, no autoplay ever happens.
     - Save-Data / 2g / slow-2g -> same as above.
   The third case — "errors, or never reaches canplay" — needs explicit
   handling below. It's not hypothetical: some engines' canPlayType()
   reports WebM/VP9 as supported but then never actually decode it —
   readyState sits at 0 (HAVE_NOTHING) indefinitely and no "error" event
   ever fires, since nothing actually failed, it just never progresses.
   A listener on "error" alone misses that case entirely, so there's a
   second, explicit timeout that retries with MP4 alone (the one format
   every engine that plays video at all can decode) if "canplay" hasn't
   fired within a few seconds. ========================================================================== */

const heroVideo = document.getElementById("hero-video");

if (heroVideo) {
  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isDataSaverOrSlow =
    connection &&
    (connection.saveData || /^(slow-2g|2g)$/.test(connection.effectiveType || ""));

  if (!prefersReducedMotion && !isDataSaverOrSlow) {
    function attachSources(list) {
      heroVideo.querySelectorAll("source").forEach((el) => el.remove());
      list.forEach(({ src, type }) => {
        const source = document.createElement("source");
        source.src = src;
        source.type = type;
        heroVideo.appendChild(source);
      });
      heroVideo.load();
    }

    // WebM/VP9 first (smaller, what Chrome/Firefox/Edge use), MP4/H.264
    // second as the fallback every engine that plays video at all can
    // decode.
    attachSources([
      { src: "assets/video/hero-bg.webm", type: "video/webm" },
      { src: "assets/video/hero-bg.mp4", type: "video/mp4" },
    ]);

    let hasReachedCanplay = false;
    heroVideo.addEventListener("canplay", () => {
      hasReachedCanplay = true;
    });

    // Explicit decode failure — drop straight to MP4-only rather than
    // waiting out the stall timeout below.
    heroVideo.addEventListener("error", () => {
      if (heroVideo.currentSrc.endsWith(".mp4")) {
        // Already on the fallback format and it still failed — give up
        // and let the poster stand in permanently.
        heroVideo.querySelectorAll("source").forEach((el) => el.remove());
        heroVideo.removeAttribute("src");
        return;
      }
      attachSources([{ src: "assets/video/hero-bg.mp4", type: "video/mp4" }]);
    });

    // Silent stall — the source was accepted but never actually became
    // playable (the WebM-claims-support-but-can't-decode-it case). Only
    // retries once: if canplay hasn't fired within 4s and we're not
    // already on the MP4 fallback, switch to it.
    setTimeout(() => {
      if (!hasReachedCanplay && !heroVideo.currentSrc.endsWith(".mp4")) {
        attachSources([{ src: "assets/video/hero-bg.mp4", type: "video/mp4" }]);
      }
    }, 4000);
  }
}

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
