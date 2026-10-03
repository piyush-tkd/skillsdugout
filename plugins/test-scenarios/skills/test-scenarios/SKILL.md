---
name: test-scenarios
description: "Use when writing test scenarios or test cases for QA, developers or business analysts to run — for a fix, a feature, or a change that needs checking before release."
---

# Writing test scenarios

The reader is a tester or developer who will run these, not someone reviewing how they were found. Write only what they need to set up the case, run it, and know whether it passed.

## The format

1. Numbered scenarios.
2. Each scenario title is **bold** and states the condition in plain words.
3. Nested numbered sub-points underneath, skipping any that add nothing:
   1. Setup — only if it is not obvious.
   2. Action — what to do.
   3. Expected — what should happen, as one sentence.
   4. Status — one word, when known: Not run, Blocked, Passed, Failed.

## Rules

1. **Plain business words for conditions.** "Order already shipped", not `fulfillment_status = 'SHIPPED'` and not "Shipped = Yes".
2. **Exact values where the test depends on them.** Boundary tests need the boundary ("a refund of exactly $100.00"). API and integration tests may name the endpoint, field and response code.
3. **State the expected result as what should happen.** "Refund should be held for manager approval and not sent to the payment provider." Not "Held", not a table cell.
4. **No tables.** Nested numbered lists only.
5. **Leave out how it was found.** No evidence, no queries, no case history.
6. **Status, not the story.** If a scenario was not run or is blocked, say so in the status line. Name what blocks it in a few words if the tester needs to know; leave out the analysis.
7. **No introduction line.** Start with the first scenario, or a one-line heading such as "Two scenarios to run:".
8. **No icons or emoji.**

## Example

Two scenarios to run:

1. **Refund under the approval limit, order not yet shipped.**
   1. Setup: any test order under $100 that is still in Packing.
   2. Action: refund the full amount from the agent screen.
   3. Expected: refund should go straight to the payment provider with no approval step.
   4. Status: Not run.
2. **Refund of exactly $100.00, order already shipped.**
   1. Action: refund $100.00 on a shipped order.
   2. Expected: refund should be held for manager approval and not sent to the payment provider.
   3. Status: Blocked — no shipped test order in staging.

## Before sending

1. Could a tester who was not in the conversation run each scenario from the text alone?
2. Is every condition written in words the business uses, with exact values only where the test needs them?
3. Does every scenario say what should happen, as a sentence?
4. Is every scenario's status stated when it is known?
5. Is there anything here that explains the analysis rather than the test? Delete it.
