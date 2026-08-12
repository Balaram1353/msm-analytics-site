# Publication-readiness audit

Copy audit only — nothing under `case-studies/` touched. Sources: the four
`[CHECK]` flags across `files/*.md`, `Project_Documentation.md` (the
internal master doc those whitepapers were drawn from — checked because it
sometimes carries a flag the whitepaper doesn't repeat), `Framer_Content_Reference.md`
(the original copy-planning doc, checked because it's where one of the two
new findings below traces back to), the three live pages under
`case-studies/`, `index.html`, and `docs/msig-rewrite-draft.md`. Repo-wide
grep for anything resembling data-provenance language (API, scrape,
public filing, dataset source) turned up nothing beyond what's cited below.

**Headline finding, stated up front:** two items below are not from the
whitepapers at all. One is a claim already live on three pages that
nothing in the repo supports and one page directly undercuts. The other
is a claim my own last draft introduced without a source. Both are in the
inventory as new rows, not folded into the four original flags.

**Update — QuantivRisk data provenance resolved.** Rows 2 and 3 (Tesla
naming, Tesla provenance) are closed. The data is QuantivRisk-supplied —
client-provided, not independently sourced by MSM — and the decision is
that Tesla is not named on the site: whose relationship it is to disclose
is QuantivRisk's, not MSM's, and the gain from "Tesla telemetry" over
"vehicle telemetry" doesn't justify asking. These are decisions, not
answered client questions — closed by MSM, not by an email back. Don't
reopen either without a new reason to revisit; see each row and §2/§3
below for the reasoning. `files/quantivrisk-accident-causation.md`'s
`[CHECK] Data source` flag has been replaced with this same resolution
inline.

---

## 1. Full [CHECK] inventory

None of the eight items below sort cleanly into **(a) resolvable from
repo material**. This repo holds marketing copy and two internal planning
docs — no project code, notebooks, or model artifacts for any of the
three engagements. The whitepapers and `Project_Documentation.md`
corroborate each other everywhere they overlap, but neither one goes
further than what's already summarized in the table. Where a fact isn't
strictly "ask the client" either, I've said so in the notes rather than
forcing it into (b).

| # | Claim | Reaches | Category | Source / resolution |
|---|---|---|---|---|
| 1 | QuantivRisk's model is "a Bayesian model" — exact method (Naive Bayes / Bayesian Network / other) unconfirmed | QuantivRisk page, "The approach" (3 mentions) + Technologies list; the gap-marked title in `docs/msig-rewrite-draft.md` §2 | **(b)** | `files/quantivrisk-accident-causation.md` `[CHECK] Model type`; `Project_Documentation.md:124` ("once you confirm"). Not resolvable from repo — nothing here names a subtype. This is *your* model, though — check your own project notes before treating it as a question for QuantivRisk (see §2). |
| 2 | The accident-causation model was trained on Tesla pre-accident telemetry | Nowhere live — deliberately omitted, now a permanent decision rather than a placeholder | **CLOSED** | Resolved: the data is QuantivRisk-supplied (client-provided), so naming Tesla would disclose QuantivRisk's relationship, not a fact MSM can decide to publish unilaterally. The gain from "Tesla telemetry" over "vehicle telemetry" doesn't justify asking the client to clear it. `files/quantivrisk-accident-causation.md`'s `[CHECK] Data source` flag is replaced with this reasoning inline. Not reopened without a new reason to revisit. |
| 3 | How the telemetry was obtained | N/A — moot now that #2 is closed | **CLOSED** | Resolved at the level that mattered for MSM's own disclosure obligations: the data is QuantivRisk-supplied, client-provided, not independently sourced or acquired by MSM. How QuantivRisk itself originally obtained it from Tesla remains genuinely unknown and isn't worth finding out — Tesla isn't named regardless of the answer. |
| 4 | Zywave's four-model MAPE (19–30%) has no stated baseline — what a single pooled nationwide model would have scored | Nowhere live; would strengthen Zywave's "The result" section and its retitle | **(b)** | `files/zywave-premium-prediction.md` `[CHECK] Baseline comparison`; `Project_Documentation.md:125`. This may already exist in your own project archive from validating the segmentation decision — worth checking before it becomes a Zywave question (see §2). |
| 5 | MSIG has no quantified outcome/impact metric (adoption, time saved, reports replaced) | MSIG page's "The result" section, Result badge, H1 | **(b)** | `files/msig-competitive-analysis-dashboard.md` `[CHECK] Outcome metric`. **Still open** — `docs/msig-rewrite-draft.md` added scope numbers (below) but explicitly did not claim to resolve this; the original ask (an *outcome* figure) stands. |
| 6 | MSIG's dashboard covers 11 analysis views, 7,320 companies, ~30 metrics across 6 categories | `docs/msig-rewrite-draft.md`'s Problem/Approach/Engineering/Result blocks and Result badge — **not yet in any live page** | **(b)** | Supplied by you last session, sourced from the same dashboards already ruled out for screenshots. Already flagged once in that draft's own §3 — carried forward here for a complete inventory, not a new find. |
| 7 | **[New]** "…with hands-on AWS SageMaker expertise to train and deploy models like this in production" | **Live now**: `index.html` (homepage Zywave card), `case-studies/msig-competitive-analysis-dashboard.html` (Zywave teaser), `case-studies/quantivrisk-accident-causation-analysis.html` (Zywave teaser). **Absent** from Zywave's own page. | **Doesn't fit a/b/c cleanly** | See discussion below the table. |
| 8 | **[New]** MSIG's dashboard runs "across the full dataset… not a curated subset built to demo well," and cross-view consistency holds "across all eleven [views]" | `docs/msig-rewrite-draft.md`'s "The result" and "The approach" blocks — not yet live | **Self-verify, not (a)/(b)/(c)** | See discussion below the table. |

**Row 7 in full.** This sentence is not in `files/zywave-premium-prediction.md`,
not in `Project_Documentation.md` (whose tech list for this project reads
"Python, Pandas, EDA/visualization libraries, regression modeling
(scikit-learn)" — no AWS, no SageMaker), and not in Zywave's own
Technologies list on its own detail page. It exists in exactly one other
place: `Framer_Content_Reference.md`, the original copy-planning doc
("We also bring hands-on AWS expertise, including training and deploying
models like this through SageMaker"), from which it was carried
word-for-word into three other pages. "AWS" and "SageMaker" do not appear
anywhere else on the site — not in Services, not in About — so this isn't
general firm-capability boilerplate that happens to sit near the Zywave
teaser; it's an isolated, specific claim tied to "models like this,"
i.e. Zywave's models specifically. I'm not sorting this as **(b)**
because Zywave isn't the authority on what infrastructure *you* used —
this is your own delivery detail to confirm, not theirs to answer. It
isn't **(a)** because nothing in the repo supports it (Project
Documentation actively contradicts it by omission). Practically: check
your own memory or project records for whether SageMaker specifically
trained/deployed the Zywave models. If yes, it can stay, possibly with a
courtesy note to Zywave since it's a specific claim about their delivered
system's infrastructure. If you can't confirm that specifically — as
opposed to knowing AWS/SageMaker generally — cut it, or split it into an
unambiguously general sentence ("MSM Analytics also has hands-on AWS
SageMaker experience") detached from "models like this."

**Row 8 in full.** Both clauses are claims I added in the last pass about
how MSIG's actual, delivered dashboard behaves in production — not
copied from any whitepaper, not derivable from the repo. They read as
confident factual statements ("not a curated subset," "no matter which
screen a user was looking at"), which means they need to be *true*, not
just plausible-sounding. This isn't a client question — MSIG wouldn't be
positioned to verify infrastructure details of a dashboard you built for
them any better than you are — and it isn't repo-resolvable either. It's
on you to confirm before either line ships: was the interactivity ever
demoed or handed over on a filtered/sample subset rather than the live
7,320-company set, and did the cross-view consistency claim hold as
built, not just as designed. If either is uncertain, cut that clause;
the surrounding sentences don't depend on it.

---

## 2. Consolidated external-questions list

### MSIG

1. "Can you share one usage or impact figure for the competitive analysis
   dashboard — how many people use it regularly, time saved versus the
   old manual process, or how many static reports it replaced? We'd like
   the case study to include a real outcome number rather than only
   describing how the tool works."
2. "We'd like to reference the dashboard's scale in the case study —
   roughly 7,320 companies, 11 analysis views, and about 30 metrics
   across 6 categories. No screenshots, just those figures in text. Are
   you comfortable with that being public?"

### QuantivRisk

1. "For the case study, can you confirm the specific Bayesian method
   used — a Naive Bayes classifier, a Bayesian network, or another
   Bayesian approach? Naming the exact method would strengthen the
   technical credibility of the write-up."

~~2. Tesla naming.~~ **Closed — don't send.** Decided instead of asked:
Tesla is not named on the site. The data is QuantivRisk-supplied, so
naming a third party's data relationship is QuantivRisk's call to make,
not something worth spending a client ask on for the marginal gain of
"Tesla telemetry" over "vehicle telemetry." See §1, row 2.

~~3. Tesla data provenance.~~ **Closed — don't send.** Moot now that #2
is closed — how QuantivRisk itself obtained the data from Tesla no
longer needs an answer, since Tesla isn't being named regardless. See
§1, row 3.

### Zywave

1. "Do you have, or can you share, the MAPE of a single pooled/nationwide
   premium model measured before the four-model segmented approach was
   adopted? A before/after comparison would let us describe the result
   as a demonstrated improvement rather than a standalone number."

**Not on any client's list, on purpose:** the AWS SageMaker claim (row 7
above) isn't a question for Zywave — it's not about their business, it's
about your own delivery stack, and they wouldn't be the authority on it
even if asked. Resolve it yourself first (§1, row 7); only loop Zywave in
afterward, and only if you confirm the claim and decide it's specific
enough about their system to warrant a courtesy heads-up.

---

## 3. QuantivRisk data provenance — RESOLVED

Original finding, for the record: checked `files/quantivrisk-accident-causation.md`
in full, `Project_Documentation.md` in full, and grepped the entire repo
for anything resembling data-acquisition language (API, scrape, public
filing, dataset source, acquired, obtained). Every mention of the data
was a variant of "Tesla pre-accident telemetry data" or "Tesla
pre-accident sensor/telemetry data" — never how it was reached, and
nothing in the repo recorded a method.

**Resolved:** the data is QuantivRisk-supplied — standard client-provided
data, not independently sourced or acquired by MSM. That answers the
question that actually mattered for MSM's own disclosure obligations.
How QuantivRisk itself originally obtained the data from Tesla is a
separate, deeper question that's still genuinely unknown — but it no
longer needs answering, since the accompanying decision (§1, row 2) is
that Tesla isn't named on the site regardless of how QuantivRisk got it.
Not reopened without a new reason to revisit.

---

## 4. Ship-without-answers assessment

**QuantivRisk page — ships clean as-is, zero cost.** The model-subtype
flag was correctly never added to the live page — an aspirational
strengthening sitting in the whitepaper's own `[CHECK]` note, not a
published claim needing removal; this page can wait indefinitely for
that one email with nothing lost in the meantime. Tesla sourcing is no
longer an open flag at all: resolved as a decision, not an outstanding
question — see §1, rows 2–3. Nothing left to wait on there.

**Zywave's own page — also ships clean as published content**, same
logic: the baseline-MAPE flag was never added, nothing to cut. **But this
is the one page where "ship without answers" isn't the real question.**
The SageMaker claim about Zywave (§1, row 7) is not held back pending an
answer — it's already live, right now, on three surfaces (the homepage
and two other case studies' teasers, all pointing at Zywave). That's a
different risk category from "hasn't been added yet": it needs your own
verification on its own timeline, independent of anything a client emails
back.

**MSIG page — ships clean as published content today; the open question is what happens if the draft rewrite goes ahead before sign-off.**
The live page currently makes no quantified claim about MSIG at all, so
row 5's flag (no outcome metric) costs nothing by staying open — it's the
same state the page has always been in. If `docs/msig-rewrite-draft.md`
gets built before MSIG answers §2's questions: the H1 retitle ("MSIG
replaces three manual filters with one self-serve selection") is safe to
ship immediately — it uses only the process description already public,
zero disputed numbers. The Result-badge rewrite and the four body
insertions that reference 7,320 / 11 / ~30 / 6 all need MSIG's sign-off
first (row 6); shipped before that, the draft has to fall back to
number-free phrasing — which is exactly what the page already has today.
What's lost by waiting is concreteness (the sharpened "unreliable, not
tedious" diagnosis, the cross-view grounding, the star-schema scale
grounding, the "not a curated subset" close) — not the underlying
argument, which the current live page already carries without any of it.
Row 8's two self-verify clauses should be resolved (confirmed or cut)
independent of MSIG's sign-off, before the rewrite ships at all — that
one isn't theirs to clear.
