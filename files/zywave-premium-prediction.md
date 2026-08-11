# Multi-State Vehicle Insurance Premium Prediction

**Client:** Zywave
**Discipline:** Predictive modelling, regression
**Result:** Four production models, 19–30% MAPE

---

## The problem

Vehicle insurance premiums are not set by one logic. What drives price in one
state is close to irrelevant in another — regulation differs, risk profiles
differ, and the relationship between a policyholder's attributes and their
premium shifts accordingly.

A single nationwide model averages all of that away. It will look reasonable
in aggregate and be quietly wrong in the states that matter most, because the
states with the highest policy volume are exactly the states whose patterns
get diluted by pooling.

Zywave needed premium estimates that held up state by state, not on average.

## The approach

**Segmented rather than unified.** Four models were trained instead of one:
three dedicated models for individual high-volume states with patterns
distinct enough to warrant them, plus one general model covering the
remaining US states.

That split was a decision, not a default. Two things had to be balanced
against each other:

- **Accuracy per state.** A dedicated model captures regional premium
  determinants a pooled model would flatten.
- **Data volume per state.** A dedicated model is only better if there is
  enough data behind it. Below a certain volume, a state-specific model
  overfits and the pooled model is genuinely the better estimator.

Deciding which states cleared that bar — and which were better served by the
general model — was the substantive modelling judgement in this engagement.

**Data preparation.** Client-provided data arrived across states with
inconsistent formats and definitions. Cleaning and reconciling it was
non-trivial and preceded any modelling: exploratory analysis established the
distributions, the relationships between variables, and, critically, the
state-level variation that justified segmentation in the first place.

**Evaluation.** Performance was measured as MAPE — Mean Absolute Percentage
Error — across all four models. MAPE was chosen because it is directly
interpretable: a MAPE of 20% means predictions land, on average, within 20%
of the actual premium. That is a number an underwriter can reason about
without a statistics background.

## The result

Four trained models in production, with MAPE ranging **19% to 30%** across
them.

The range is the honest number. The dedicated state models perform toward
the tighter end; the general model, covering more heterogeneous territory,
sits wider. Reporting a single averaged figure would have obscured exactly
the variation the segmentation strategy was built to address.

## Why this was built to be explainable

Every element of this system can be inspected:

- The choice of which states got dedicated models is a documented decision
  with stated criteria, not an automated selection.
- The features driving each model's predictions can be listed and ranked.
- The error metric is a percentage, not a composite score.

An underwriter asking "why is this policy priced here" can be given an
answer. That was a design constraint from the start, not a reporting
afterthought.

## Technologies

Python · pandas · scikit-learn · exploratory data analysis and visualisation
libraries

## What a similar engagement looks like

If your pricing, forecasting, or risk scoring currently runs on a single
model across meaningfully different segments — geographies, product lines,
customer tiers — the same question applies: is the pooled model hiding
variation you would act on if you could see it?

That is usually answerable in a short diagnostic before any modelling work
is committed to.

---

*[CHECK] Baseline comparison — if a single-nationwide-model MAPE was measured
before segmentation, adding it here would turn "19–30%" from a number into a
demonstrated improvement. This is the single strongest addition available to
this document.*
