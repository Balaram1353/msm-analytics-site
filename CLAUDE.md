## Design tokens

These tokens are mirrored in styles/tokens.css — that file is the implementation, this block is the contract. Keep them in sync.

```css
:root {
  /* Ground & ink */
  --ground:      #EEF1F0;
  --surface:     #F7F9F8;
  --ink:         #12231F;
  --caption:     #5B6B66;

  /* Chart language */
  --centerline:  #2B6E5B;  /* rail, CTA, in-control signal */
  --band:        #C7DAD3;  /* confidence band fill, borders */
  --flag:        #C22F39;  /* ALARM. The out-of-control point ONLY.
                              Never a button. Max 1 use per viewport. */

  /* Type */
  --t-xs:   0.75rem;
  --t-sm:   0.9375rem;
  --t-base: 1.0625rem;
  --t-md:   1.25rem;
  --t-lg:   1.5rem;
  --t-xl:   2rem;
  --t-2xl:  2.75rem;

  --font-display: "Martian Mono", ui-monospace, monospace;
  --font-body:    "Public Sans", system-ui, sans-serif;

  /* Spacing — 4px base. These values exist and no others. */
  --s1: 4px;  --s2: 8px;  --s3: 12px; --s4: 16px;  --s6: 24px;
  --s8: 32px; --s12: 48px; --s16: 64px; --s24: 96px; --s32: 128px;

  /* Rhythm */
  --section-y:   var(--s24);
  --section-max: 1140px;
  --rail-x:      var(--s12);
  --radius:      999px;  /* pills only. Cards use 4px. Nothing else. */
}
```

- Every value in every stylesheet must resolve to a variable above. No ad-hoc
  hex codes, px values, or margins. If a value you need isn't here, ask first.
- Every section, same order: eyebrow (--t-xs, mono, uppercase, --caption)
  → h2 (--t-xl) → subhead (--t-md, --caption) → content.
- Exactly two typefaces. No third face, ever.
- ONE call to action per section. No secondary ghost buttons anywhere.
- --flag appears at most once per viewport, and never on an interactive element.
- The rail is present in every section and narrows monotonically down the page.
  It must degrade to a static 2px line under prefers-reduced-motion.
- Quality floor: responsive to 360px, visible keyboard focus on every
  interactive element, all text at least 4.5:1 contrast.
