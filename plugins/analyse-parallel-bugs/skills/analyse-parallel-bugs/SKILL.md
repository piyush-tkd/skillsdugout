---
name: "analyse-parallel-bugs"
description: "Use when several problems are reported at once and need triaging together — a list of complaints from the floor, a batch of failures after a deploy, \"here are six things that are broken\", or any time the count of reports is not yet known to be the count of causes. Also use when one report is suspected of having several independent causes behind it."
---

# Analysing several bugs at once

## What this is for

A list of problems arrives together. The job is to find out **how many causes there actually
are**, verify each one, and hand back an ordered list somebody can act on.

The whole reason this needs a method is that the obvious approach — take them in order, diagnose
each — gets two things wrong. It misses that six reports are often three causes, and it spends the
same effort on the cosmetic one as on the one moving money.

## The one rule that matters most

**A count of reports is not a count of bugs.** Sketch the mapping before going deep on any one report, and revise it as
evidence comes in — diagnosis will often change it.

Three shapes, and they need different work:

- **Many reports, one cause.** The common case after a deploy. Find it once and six tickets close.
- **One report, many causes.** The dangerous case. Fix the first, the symptom persists, and the
  reporter concludes the fix did not work.
- **Genuinely independent.** Then order them and go, but prove it rather than assuming it.

## The pass

### 1. List the symptoms, not the diagnoses

Write down what was *observed*, in the reporter's words. Not what you think causes it.

A symptom recorded as "the retry logic is broken" has already picked a suspect, and every later
step will look for evidence that confirms it. "The row still shows as failed after pressing retry"
keeps the field open.

### 2. Group by suspected shared cause, and mark each group UNPROVEN

Cluster them. Then write the word UNPROVEN next to each cluster, because a grouping is a hypothesis
and it is the one most likely to be wrong — related symptoms feel like one bug long before they are
shown to be one.

The cheapest test of a grouping is usually a timestamp or a version: did they all start at the same
moment? Did they all appear in the same release?

### 3. Verify each cause separately, and name the falsifier first

For each cause, **before** you go looking: write down what would make this claim false, then go and
look for that.

Confirming evidence is easy to find for a wrong answer. An honest attempt to falsify is the only
thing that separates a verified claim from a plausible one.

Specific traps, each of which has produced a confident wrong answer:

- **A sample proves what it contains, never what it lacks.** Searching a sample, not finding the
  thing, and concluding it does not exist is only valid if the sample was guaranteed to contain it.
  Check that the population you sampled is the population that would hold the answer.
- **Do not generalise from the part you happened to read.** Reading a fraction of a diff, a log or a
  file and concluding about the whole is a guess. Find the check that covers all of it — usually
  cheaper than reading the rest.
- **Agreement today is not agreement by design.** Two numbers that match on young data may be
  coincidence. Ask what would separate them and whether that has happened yet.
- **Check whether the defect is yours.** Before reporting something as pre-existing, confirm it is
  not from work done in this session. Attributing your own mistake to the codebase wastes
  everybody's time twice.

### 4. Separate what is broken from what is merely surprising

Not everything reported is a defect. Before calling any behaviour correct, establish what was
expected — from a requirement, a spec, or the person who owns the behaviour. Existing code alone does
not prove intent.

Four outcomes, and they read very differently to whoever raised it:

- **Broken** — behaves wrongly. Fix it.
- **Correct but badly explained** — the behaviour is right and the label, message or name lies about
  it. Fix the words, and say plainly that the behaviour was right, because "we changed the label"
  reads as a brush-off unless the reason is given.
- **Correct and surprising** — right, well described, and still unexpected. Explain it. Changing it
  would be the bug.
- **Undetermined** — the expected behaviour or the evidence is not settled yet. Say what would
  settle it, and do not force one of the other three.

Getting this wrong in either direction is expensive. Treating a wording problem as a logic bug
produces a migration nobody needed; treating a logic bug as a wording problem ships the wrong
numbers with nicer labels on them.

### 5. Order by consequence, not by effort

Sort by what it costs to leave alone. The default order:

1. Wrong data leaving the system — anything reaching a customer, a payer, a partner or a ledger
2. Blocked work — somebody cannot do their job
3. Invisible failure — it is wrong and nothing says so
4. Visible annoyance — wrong, and everybody can see it is wrong
5. Cosmetic

Adjust it with judgment: how many people it reaches, whether the harm is still happening, and
whether it can be undone. An invisible failure that corrupts records daily outranks blocked work
with a workaround.

A cheap fix low on that list can be done first for momentum; say that you are doing it for that
reason rather than letting the order imply it matters more.

### 6. Report

Per cause, tight:

- **What is wrong**, in plain words, and the evidence that settles it — a number, a query result, a
  code path
- **Which reported symptoms it explains.** If a symptom is left over, mark it **unexplained** — it may
  be another cause, or an incomplete explanation of this one
- **Broken / badly explained / correct-and-surprising / undetermined**
- **What it costs to leave**, and roughly what it costs to fix
- **Anything you could not verify**, and what would settle it

Then one recommendation for the whole set: what to do now, what to ticket, what to leave.

## Say what you did not check

An unverified claim presented alongside verified ones inherits their credibility. Mark it.

"I think X, and the way to know is Y" is worth more than a confident wrong answer, and it costs
nothing to write. An analysis with three proven findings and one honest "unproven" is far more
useful than four findings of unmarked mixed quality.

## Red flags — stop and re-check

- You have as many causes as there were reports. Suspiciously tidy; look for the shared one
- A cause was found without anything being run or read
- Evidence was gathered only to confirm an answer already chosen
- You are about to report a defect in code you touched this session
- A symptom is unexplained but the analysis is being presented as complete
- Everything on the list is high priority

