# Interactive Competitive Analysis Dashboard

**Client:** MSIG
**Discipline:** Business intelligence, data modelling, interactive reporting
**Result:** A Power BI dashboard that behaves like an application, not a report

---

## The problem

Most competitive analysis reporting fails the same way. The data is present,
the visuals are correct, and using it is exhausting — because answering any
real question means manually reconfiguring filters.

Which companies compete with this one? Filter the competitor table by hand.
Which companies sit in the same cluster? Filter again. How do their products
compare within a category? Filter a third time, and hope the filter context
across the three visuals still means what you think it means.

The result is a report people open once and stop using. Not because the
analysis is wrong, but because extracting an answer costs more effort than
the answer is worth.

MSIG needed a tool where selecting a company *asks the question for you*.

## The approach

**Selection drives the analysis.** The core design decision was that a single
selection should reconfigure the surrounding context automatically:

- **Cluster-aware slicing** — selecting a company surfaces every company in
  its cluster, without a second filter action.
- **Competitor discovery** — selecting a company surfaces its competitors
  automatically, derived from modelled competitor relationships rather than
  manual tagging at query time.
- **Category-aware product filtering** — selecting a product narrows the view
  to related products in the same category.

Each of these is a slicer whose contents depend on another slicer's
selection. That interdependence is the hard part, and it is where most
dashboards of this kind give up and hand the work back to the user.

**Default plus optional comparison.** Three companies display by default,
with button-driven controls to add or remove optional comparators. This
avoids the two standard failure modes — a chart so crowded it is unreadable,
or an empty chart requiring five clicks before it shows anything.

**Visual encoding of comparison type.** Default companies render as solid
lines; optional comparators as dotted. The chart itself communicates which
series are the baseline and which the user added, without a legend lookup.

**Dynamic ranking.** Top-N analysis surfaces the leading products or
companies by whichever metric is selected, recalculating rather than
requiring a separate visual per metric.

**Simplified time filtering.** Year-based slicers derived from full date
fields — because a business user comparing annual performance should not have
to navigate a date hierarchy to do it.

## The engineering underneath

The interactivity above rests on deliberate data modelling, not on visual
configuration:

- **Star schema principles** — lookup, fact, and bridge tables with
  one-to-many relationships, structured so filter context propagates
  predictably.
- **DAX measures** using `CALCULATE`, `FILTER`, `SELECTEDVALUE`, `ALL`,
  `RANKX`, and `SWITCH`, with variables and deliberate context transition.
- **Bookmarks and buttons** for the state changes driving the add/remove
  comparison controls.

The recurring challenge across all of it was managing filter context across
multiple interacting visuals — ensuring that a selection in one place
produced the intended effect everywhere, and no unintended effects anywhere.

## The result

A Power BI dashboard that operates as a lightweight BI application rather
than a static report: users explore company relationships, competitor
networks, and performance metrics interactively, and the manual filtering
that made the previous approach unusable is largely eliminated.

## Why this counts as explainable work

Interactivity of this kind is often built with hidden logic — hardcoded
relationships, opaque calculated columns, rules embedded where nobody can
find them later.

This was built the other way. The competitor and cluster relationships live
in the data model as explicit tables. The measures are DAX that can be read.
Anyone maintaining this dashboard after handover can trace why a given
company surfaced as a competitor, because the relationship is a row in a
table rather than a rule buried in a query.

That matters more than it sounds. A dashboard nobody can modify is a
dashboard with an expiry date.

## Technologies

Power BI Desktop · DAX · Power Query · data modelling · interactive
visualisations

## What a similar engagement looks like

If your team has reporting that is technically correct and rarely opened, the
problem is usually not the data — it is that answering a question takes too
many actions.

That is diagnosable quickly: watch someone try to answer a real question with
the existing tool and count the clicks.

---

*[CHECK] Outcome metric — this project has no quantified result, unlike the
other two. "Behaves like an application rather than a report" is a
description, not evidence. If any usage figure exists — adoption, time saved,
reports replaced — it would materially strengthen this page. If none does,
consider whether this case study should sit third rather than first.*
