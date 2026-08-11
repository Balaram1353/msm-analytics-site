# Accident Causation Analysis Using Bayesian Modelling

**Client:** QuantivRisk
**Discipline:** Probabilistic modelling, interpretable inference
**Result:** Per-cause probability outputs replacing single-verdict classification

---

## The problem

When a vehicle accident is analysed after the fact, the question that
matters is *why it happened* — and the honest answer is rarely one thing.

Conventional classification models are built to give a single answer. Fed
pre-accident conditions, they return one label: the cause. That is
convenient and frequently misleading. Accidents are usually the product of
several conditions arriving together, and a model that names one has
discarded the others rather than weighed them.

Worse, a single-label output is difficult to challenge. If the model says
"excessive speed," there is nothing to interrogate — no second candidate, no
sense of how confident the verdict is, no visible reasoning. In a domain
where the analysis may be reviewed by a claims team, a regulator, or opposing
counsel, an unexplainable verdict is close to unusable.

## The approach

**Reframing the output.** Rather than predicting *the* cause, the model
estimates the probability that each of several candidate factors contributed
to a given incident. Multiple simultaneous contributing factors can be
quantified rather than collapsed into a winner.

**Feature engineering by threshold.** Continuous pre-accident telemetry —
speed and other measured conditions — was converted into binary risk
indicators using rule-based thresholds. Speed at or above 80 km/h, for
instance, flags as a high-speed condition present; below it, absent. Similar
threshold rules were applied across the other relevant pre-accident
variables.

This binarisation is the part of the work most people underestimate. The
thresholds are not arbitrary — they have to be defensible, because every
downstream probability inherits them. A threshold set carelessly produces a
model that is internally consistent and externally indefensible.

**Probabilistic training.** A Bayesian model was trained on the binarised
dataset to learn the conditional relationships between flagged conditions and
accident occurrence. The structure matters here: the model learns how these
factors relate to each other, not just how each relates to the outcome in
isolation.

**Inference.** For any given accident record, the model returns a probability
score per candidate cause. Not a ranking, not a label — a distribution.

## The result

Given the state of a vehicle immediately before an accident, the system
outputs the probability that each of several factors contributed.

The practical difference: instead of "cause: excessive speed," the output
reads as a breakdown — this factor at one probability, that factor at
another, several factors present simultaneously with their relative weights
visible.

That is a document a claims analyst can work from and a reviewer can
challenge on specifics.

## Why this is the clearest case for explainable modelling

This engagement is the sharpest illustration of a principle applied across
all our work: a model that cannot show its reasoning is a model whose output
cannot be defended.

Three properties make this one inspectable end to end:

- **The thresholds are stated.** Anyone can see what counted as a high-speed
  condition and disagree with it.
- **The output is a distribution, not a verdict.** Uncertainty is visible
  rather than hidden behind a confident label.
- **The relationships are learned, not asserted.** The conditional structure
  between factors is derived from data and can be examined.

None of that is available from a black-box classifier returning one word.

## Technologies

Python · pandas · Bayesian probabilistic modelling

## What a similar engagement looks like

If you currently make decisions from a model that outputs a single
classification — fraud or not, high risk or low, approved or declined — the
question worth asking is whether the people acting on that output can
explain it when challenged.

Converting a classifier into a probabilistic model that shows its reasoning
is usually less work than it sounds, and it changes what the output is
usable for.

---

*[CHECK] Model type — the PDF documentation flags that the specific Bayesian
method (Naive Bayes, Bayesian Network, or other) is unconfirmed. This
document says "a Bayesian model" throughout, which a technical reader will
notice. Naming it strengthens the paper considerably.*

*[CHECK] Data source — the source documentation identifies the telemetry as
Tesla pre-accident data. That detail is deliberately omitted here: naming
your client's data source is a wider disclosure than naming your client, and
should be confirmed with QuantivRisk before publication.*
