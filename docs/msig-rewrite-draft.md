# MSIG rewrite draft + retitles for all three

Copy only. Nothing under `case-studies/` has been edited — this is proposed
text for you to place, not a diff against the live files. Read against
`docs/case-study-ux-board.md` (prior report, retitle proposals) and the
three source whitepapers in `files/*.md`, which carry their own `[CHECK]`
flags this draft inherits rather than resolves.

**Updated after `docs/publication-checklist.md`:** two clauses this draft
originally proposed — cross-view consistency "across all eleven [views]"
in the Approach block, and "not a curated subset built to demo well" in
the Result block — asserted how the built dashboard actually behaves
without a source for either claim. Both are cut below; those two blocks
are now unchanged from the live copy. See each block's "Why" note for
detail.

---

## Judgment call, stated up front, per your instruction

**Scale (11 views, 7,320 companies, ~30 metrics/6 categories) is not
outcome evidence, and I haven't written around that.** Zywave's 19–30%
MAPE tells you how well the thing worked. QuantivRisk's "per-cause
probability vs. single verdict" tells you what capability changed. Scale
tells you neither — it tells you how much ground the build covered. A
bigger dataset isn't a better result; a dashboard covering 500 companies
that replaced three filters with one selection would be the identical
outcome.

What scale *is* good for: making the existing claims concrete instead of
abstract. "Manual filtering is exhausting" is an assertion. "Manual
filtering across 7,320 companies is unreliable, not just tedious" is a
claim a reader can evaluate. Scale is doing evidentiary work for the
*engineering-difficulty* claims already on the page, not standing in as a
result of its own.

Because of that distinction, the rewrite below uses the numbers wherever
they sharpen an existing claim, and does **not** use them in the title or
promote them into the Result badge as if they were the outcome (see §2
for where that line falls). It originally did this in four places; two
have since been retracted (see the update note above) because they
asserted dashboard behavior rather than dataset size, which scale numbers
alone can't support. Two remain: the Problem block and the Engineering
block below.

---

## 1. MSIG body rewrite, block by block

### Block: Page header (H1 / discipline / Result)

**Existing**
- H1: *Interactive Competitive Analysis Dashboard*
- Discipline: *Business intelligence, data modelling, interactive reporting*
- Result: *Three manual filters replaced by one selection*

**Proposed**
- H1: **MSIG replaces three manual filters with one self-serve selection**
- Discipline: *Business intelligence, data modelling, interactive reporting* — unchanged
- Result: **One selection, reconfiguring analysis across 7,320 companies**

**Why:** H1 is the retitle from §2 — verb-first, matches the board's
finding. Discipline line is left alone on purpose: every page on the site
uses it for skill-domain, never stats (Zywave: "Predictive modelling,
regression," QuantivRisk: "Probabilistic modelling, interpretable
inference") — breaking that pattern on one page for numbers that don't
belong there anyway would be inconsistent for no gain.

The Result badge is the one place I *did* let a scale number in, and it
needed a rewrite regardless of that: the old badge text ("Three manual
filters replaced by one selection") is now almost identical to the new H1,
which makes the badge redundant the moment the retitle ships. The new
version keeps the same real outcome (one selection, not three filters) but
adds the scale as a qualifier on *how far that outcome reaches* — "the
interactivity holds at this scale," not "this scale is the achievement."
That's the distinction from the judgment call above, applied to the one
line on the page most likely to be misread as a stat callout.

---

### Block: The problem

**Existing**
> Most competitive analysis reporting fails the same way. The data is
> present, the visuals are correct, and using it is exhausting — because
> answering any real question means manually reconfiguring filters.
>
> Which companies compete with this one? Filter the competitor table by
> hand. Which companies sit in the same cluster? Filter again. How do
> their products compare within a category? Filter a third time, and hope
> the filter context across the three visuals still means what you think
> it means.
>
> The result is a report people open once and stop using. Not because the
> analysis is wrong, but because extracting an answer costs more effort
> than the answer is worth.
>
> MSIG needed a tool where selecting a company *asks the question for you*.

**Proposed**
> Most competitive analysis reporting fails the same way. The data is
> present, the visuals are correct, and using it is exhausting — because
> answering any real question means manually reconfiguring filters.
>
> Which companies compete with this one? Filter the competitor table by
> hand. Which companies sit in the same cluster? Filter again. How do
> their products compare within a category? Filter a third time, and hope
> the filter context across the three visuals still means what you think
> it means. **MSIG's dataset ran to 7,320 companies, each tracked across
> roughly 30 metrics in six categories — at that scale, the three-step
> filter isn't tedious, it's unreliable: nobody reruns it identically
> every time.**
>
> The result is a report people open once and stop using. Not because the
> analysis is wrong, but because extracting an answer costs more effort
> than the answer is worth.
>
> MSIG needed a tool where selecting a company *asks the question for you*.

**Why:** the original never says *why* manual filtering specifically
fails — it asserts "exhausting" and moves on. The inserted sentence
converts that into a checkable claim (at this size, manual repetition
degrades) and upgrades the diagnosis from "tedious" to "unreliable,"
which is a sharper, truer reason the report goes unused. Everything else
in this block is untouched.

---

### Block: The approach

**Existing** (bullets unchanged, shown for the closing sentence only)
> Each of these is a slicer whose contents depend on another slicer's
> selection. That interdependence is the hard part, and it is where most
> dashboards of this kind give up and hand the work back to the user.

**Proposed**
> Each of these is a slicer whose contents depend on another slicer's
> selection. That interdependence is the hard part, and it is where most
> dashboards of this kind give up and hand the work back to the user.

**Why:** no change, retracted. The original version of this block added
"...and it had to hold not in one view but across all eleven, so a
selection meant the same thing no matter which screen a user was looking
at" — a specific claim that cross-view consistency was achieved across
all eleven views, not just designed for. That's a claim about how the
built dashboard actually behaves, not something derivable from the
whitepaper or repo, and not something MSIG is positioned to confirm
either — it needed self-verification before shipping and didn't get it
(`docs/publication-checklist.md` §1, row 8). Cut rather than left
unverified. This block is identical to the existing copy until that's
confirmed true and re-added.

---

### Block: The engineering underneath

**Existing** (first bullet only; other two bullets and the closing
paragraph unchanged)
> **Star schema principles** — lookup, fact, and bridge tables with
> one-to-many relationships, structured so filter context propagates
> predictably.

**Proposed**
> **Star schema principles** — lookup, fact, and bridge tables with
> one-to-many relationships, structured so filter context propagates
> predictably **across roughly 30 metrics spanning six categories**.

**Why:** smallest possible edit — one clause added to a bullet that was
already making the "this required real modelling" claim. Gives the DAX/
star-schema claim a size to be true *about*, instead of leaving it
unscoped. The DAX-measures bullet, the bookmarks/buttons bullet, and the
closing "recurring challenge" paragraph are unchanged.

---

### Block: The result

**Existing**
> A Power BI dashboard that operates as a lightweight BI application
> rather than a static report: users explore company relationships,
> competitor networks, and performance metrics interactively, and the
> manual filtering that made the previous approach unusable is largely
> eliminated.

**Proposed**
> A Power BI dashboard that operates as a lightweight BI application
> rather than a static report: users explore company relationships,
> competitor networks, and performance metrics interactively, and the
> manual filtering that made the previous approach unusable is largely
> eliminated.

**Why:** no change, retracted. The original version of this block added
"That holds across the full dataset — 7,320 companies, eleven views — not
a curated subset built to demo well" — a specific claim that the
interactivity was demonstrated on the full dataset rather than a sampled
or curated subset. Same problem as the approach-block retraction above:
this asserts something about how the delivered dashboard was actually
built and shown, not something the whitepaper, the repo, or MSIG can
confirm — only self-verification can, and it hadn't happened
(`docs/publication-checklist.md` §1, row 8). Cut rather than left
unverified. This block is identical to the existing copy until that's
confirmed true and re-added.

---

### Block: Why this counts as explainable work

**No change.** This section argues a different property (inspectability —
can someone trace *why* a company surfaced as a competitor) from what
scale can support (how much the dashboard covers). Inserting a company
count or view count here wouldn't strengthen the explainability argument;
it would just be a number in a section about something else. Left as-is.

### Block: Technologies

**No change**, and deliberately not a place for these numbers either —
consistent with the board's own recommendation to keep this list literal
tools (Power BI Desktop, DAX, Power Query, data modelling, interactive
visualisations), not a metrics recap.

### Block: Closing CTA ("What a similar engagement looks like")

**No change.** This block pitches a prospective client's *own* situation,
not MSIG's — MSIG-specific numbers don't belong in a section addressed to
someone else's dashboard.

### Block: "More case studies" teaser cards

**Not part of this file** — these are the `<h3>` teasers for MSIG that
live inside the *other two* pages (`quantivrisk-...html`, `zywave-...html`),
not `msig-....html` itself. If the H1 retitle in §2 ships, those two
teaser headings need the matching update too, or the site ends up with
three different titles for the same case study (H1 here, `<h3>` on two
other pages, `<h3>` on the homepage `#work` card, `<title>` tag) — same
cross-link discipline CLAUDE.md already calls out for new pages, applies
here to a retitle instead of a new page.

---

## 2. Retitles for all three

The board's "verbs mandatory, numbers optional" conclusion stands; its
"only 2 of 5 carry a number" count was under-weighted per your correction
(real ratio closer to 5–6 of 9). Weighted accordingly below: where a
number is confirmed, it's in the title. Where the only available number
is scope/scale rather than outcome (MSIG) or unconfirmed (Zywave's
baseline, QuantivRisk's model type), it's marked as a gap, not
substituted.

| Client | Current title | Proposed title (ship now) | Gap-marked upgrade (do not ship yet) |
|---|---|---|---|
| **Zywave** | Multi-State Vehicle Insurance Premium Prediction | **Zywave cuts nationwide premium error to 19–30% with four segmented models** | "Zywave cuts premium error from **[pre-segmentation baseline MAPE — not yet confirmed]** to 19–30% with four segmented models." The whitepaper's own `[CHECK]` flags this as unmeasured, not just unpublished — confirm a baseline was actually calculated before drafting this version, don't estimate one. |
| **QuantivRisk** | Accident Causation Analysis Using Bayesian Modelling | **QuantivRisk replaces single-verdict accident scoring with per-cause probability breakdowns** | "QuantivRisk replaces single-verdict scoring with per-cause **[Bayesian Network / Naive Bayes / other — model type not yet confirmed]** probability breakdowns." The whitepaper flags the exact method as unconfirmed; the shipped title says "probability breakdowns" and stays silent on method rather than guessing. |
| **MSIG** | Interactive Competitive Analysis Dashboard | **MSIG replaces three manual filters with one self-serve selection** | No gap-marked version proposed. This isn't a fact still owed — it's a case where an available number (scale) exists but doesn't answer the title's actual question ("what changed"), per §0. Adding one would be filling the gap with the wrong kind of fact, not closing it. |

**Suggested `<title>` tag / meta description for MSIG**, to travel with the
H1 if it ships (not required by the task, included since it's the same
kind of text):
- `<title>`: `MSIG Replaces Three Manual Filters With One Selection — MSM Analytics`
- `<meta description>`: keep the existing one — it already describes the
  mechanism accurately and doesn't repeat the H1 verbatim; no edit needed.

---

## 3. Claims that need MSIG's (or another client's) sign-off before publication

1. **11 analysis views, 7,320 companies, ~30 metrics across 6
   categories — flagged by you already, repeating it here as the
   top item on this list on purpose.** These numbers describe the shape
   of MSIG's own competitive-intelligence coverage — which markets, how
   many competitors tracked, how granular the metric set is. Even with no
   screenshot attached, that's information about MSIG's analytical scope
   and possibly their data-vendor relationships, sourced from a client
   engagement, from a client you name rather than anonymise. This needs
   MSIG's explicit clearance before it goes on a public page, same as the
   screenshots would have — the numbers didn't stop being client-sourced
   just because the images aren't shipping.
2. **QuantivRisk — naming the exact Bayesian method** (if confirmed and
   added per §2's gap-marked title/body). Lower sensitivity than #1, but
   still a specifics-about-the-build disclosure that wasn't in the
   original published copy — check with QuantivRisk before naming it.
3. **QuantivRisk — naming Tesla as the telemetry source.** Flagged in the
   whitepaper itself as a wider disclosure than naming QuantivRisk: this
   names a third party (Tesla) who never agreed to anything with MSM
   Analytics. Don't use "Tesla" in the title, body, or anywhere else on
   that page without confirmation from QuantivRisk specifically — their
   sign-off doesn't imply Tesla's, and this is the one item on this list
   where I'd want a clear answer on whose approval is actually required
   before treating "QuantivRisk confirmed it" as sufficient.
4. **Zywave — a pre-segmentation baseline MAPE**, if one gets measured and
   added per §2. Same logic as #1: a specific performance figure about
   Zywave's own modelling, needs Zywave's clearance before publication,
   not just factual confirmation that the number is correct.

General note that applies to all four: named-client positioning (the
thing you've said you're not giving up) means there's no anonymization
buffer if a number turns out to be wrong, outdated, or something the
client considers disclosive after the fact — regenerate this kind of
buffer by getting sign-off before shipping, not after.
