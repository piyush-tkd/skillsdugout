---
name: bug-ticket
description: "Write or rewrite a bug ticket (Jira, Linear, GitHub Issues) as a self-contained implementation and testing specification for developers, business analysts and QA."
---

# Bug ticket

Every ticket is a self-contained implementation and testing specification. The assignee must be able to implement and verify it without reading any prior conversation and without knowing who was involved.

Audience: developers, business analysts and QA.

Drafting a ticket does not authorize publishing or updating it in the tracker. Return the draft; publish only when asked.

## How it must read

These rules outrank everything below. A ticket that is accurate but unreadable fails.

- **Bullets by default.** A paragraph only where a bullet genuinely cannot carry the thought, and never more than three sentences.
- **Chronological where things happen in order.** In the Problem and the steps, describe what happens in the order it happens: step one, then two, then three. The other sections are grouped by purpose.
- **Simple words.** Write for a smart person who does not write code every day. An identifier in `code` font is fine; jargon in prose is not. Define a term once, then use the same word for it everywhere.
- **Short.** Each section earns its length. If a section runs past half a screen, it is carrying something that belongs in another ticket or does not belong at all.
- **Act-on-able fast.** A developer should know what to change within the first ten seconds of Engineering guidance. Lead that section with the change in one line, then the detail.

## Diagrams

Add one when the defect involves **three or more systems**, or when **the order of operations is the defect**. Those are the cases prose makes the reader reconstruct.

- A sequence diagram for call ordering. A flowchart for a decision path.
- Participants left to right in reading order.
- Real values in it — the actual services, the actual ids.
- Re-render if any fact changes.
- If the tracker cannot show images inline, name the file after what it shows and reference that filename in the text so the reader knows which attachment to open.

Do not attach a diagram that only restates the Problem.

## Ticket structure

Six sections, this order. Omit any with nothing useful.

### 1. Problem

Four bullets, in this order:

- What triggers it.
- What happens now.
- What should happen.
- How the user is affected.

No file names, no line numbers, no code. A business analyst must be able to read this section alone.

### 2. Scope

- The workflow and population this covers, with a number where one is known.
- What must not change. Each item here becomes a regression criterion later.
- What is deliberately excluded.
- **Decision required**, only if one blocks development. Phrase it as a question about the system — which service owns a behaviour, which of two outcomes is correct. Never as a person to go and ask.

One independently verifiable outcome per ticket. Unrelated improvements, historical cleanup and investigation each get their own.

### 3. Steps to verify

- Setup first, then numbered actions, then where to look.
- If any id is a placeholder, say so above the steps.
- If the steps were not run, say so above the steps.
- End with **Expected** and what actually happens, each labelled with how it is known — run, or derived from code.

Use the heading "Steps to reproduce" only if the steps were actually run. Never invent a test record.

### 4. Acceptance criteria

One numbered list. This is what QA signs off against, and nothing else in the ticket is.

- Each item: a condition or action, and an observable result, in a named system.
- "Removed from the `refunds` table, from the ledger, and from the customer's order history" is testable. "Deleted everywhere" is not.
- Cover success, each failure path separately, retry where one exists, and one regression item per entry in Scope's must-not-change list.

Do not add a testing section repeating these. Do not include requirements absent from Scope. Do not list investigation or cleanup as criteria. Do not pad to a round number or trim coverage to reach one.

### 5. Engineering guidance

Include this section only when the code was actually read. Otherwise state the required behaviour in Scope and the criteria, and leave the mechanism to engineering.

- **First line: the change, in one sentence.**
- Then repository, file, method. Say if a sibling repository does not have the same code.
- Then the cause, as a bulleted list with line numbers — what the code does, stated as fact because it was read.
- Then what must not change.

Code only where it makes the change clearer and only from source actually inspected. Label blocks `Current` and `Proposed`. If a snippet covers some criteria and not others, say which.

### 6. Evidence

Every claim carries how it is known, in the line itself:

- `read in code` — files and lines.
- `queried` — the system and the figures.
- `observed` — what was seen running, with environment, ids, timestamps.
- `inferred from code, not observed` — and what would confirm it.
- `reported by users` — only if it genuinely was.

Omit a category with nothing in it. Never write a line to fill a slot — an invented "reported" line is the most common version of this.

Keep exposure apart from impact. A count of requests, uploads or linked records is not a count of affected users or failed operations.

## Write a specification, not a journal

Describe the system and the required change. Not the investigation, not the people in it.

Never include who found it, who discussed it, who confirmed it, "as we discussed", "talk to <name>", or any narrative of how the finding was reached.

A person's statement is not proof. Cite code, configuration, data or observed behaviour. Use a name only for a formal role such as a named approver; assignment belongs in the tracker's own fields.

- Instead of "Talk to <name> about the email cleanup" → "Decision required: identify the service responsible for withdrawing a queued confirmation email after a refund."
- Instead of "<name> confirmed it works" → state the test scenario and its result. With no test evidence, claim nothing.

## Source rules

- Prior conversations and memory may guide investigation. They are not evidence.
- Never carry facts, ids, names, metrics or links across from the worked example below or from unrelated tickets. Every value in a real ticket comes from that ticket's own investigation.
- Treat earlier conclusions and code comments as leads, not proof.
- Reference another ticket only when its verified relationship changes implementation, sequencing or QA, and say what that relationship is in one sentence.
- Keep the essential requirement in this ticket even when a dependency is linked.
- Include historical PRs or introduction dates only when needed to understand or deliver the fix.
- Where verification was not possible, qualify the claim rather than presenting it as confirmed.

## One ticket per owning team

Split when ownership, delivery or acceptance can happen independently — different teams, different release trains, or parts QA can sign off separately. One outcome that genuinely spans repositories, owned and shipped together, stays in one ticket.

Each split ticket carries the same problem and fix scoped to its own services, plus one sentence naming the sibling and why the relationship matters. Evidence belongs on the ticket whose service produced it.

## Worked example

Fictional. Shape, density and tone only — never reuse its services, ids, line numbers or figures.

> **Title** Split-shipment refund reverses only the first parcel and reports success when half of it failed
>
> **Problem**
> - Triggered when a customer service agent refunds an order that shipped in more than one parcel.
> - The payment is refunded in full, but only the first parcel is reversed in the ledger and in the customer's order history.
> - Every parcel should be reversed in every system, or the refund should fail and say so.
> - The customer sees a parcel still listed as charged, and finance sees a ledger that does not balance.
>
> **Scope**
> - Covers refunds of split-shipment orders — about 400 a month, 3% of refunds.
> - Must not change: refunds of single-parcel orders; publishing `ORDER_REFUNDED` once per order.
> - Excluded: correcting ledger rows already left unbalanced by this defect.
> - Decision required: identify the service responsible for withdrawing the queued "your parcel is on its way" email after a refund. No service in this path touches the email queue.
>
> **Steps to verify**
> `ORD-1001` is a placeholder for a real split-shipment order. These steps have not been run.
>
> 1. Create an order that ships in two parcels. Confirm two rows in `shipments` for it.
> 2. Call `POST /api/refunds` with order `ORD-1001` and the full amount.
> 3. Check the payment provider dashboard, the `ledger_entries` table, and the customer's order history page.
>
> Expected: both parcels reversed in all three.
> Derived from code: the payment is refunded in full; only the first parcel is reversed in `ledger_entries` and order history.
>
> **Acceptance criteria**
> 1. Refunding a two-parcel order reverses both parcels in `ledger_entries` and in order history.
> 2. Refunding a three-parcel order gives the same result as criterion 1.
> 3. When the payment provider call fails, the API returns a non-2xx status and the agent screen shows the refund as failed.
> 4. When the ledger write fails, the API returns a non-2xx status and the agent screen shows the refund as failed.
> 5. A refund that failed partway can be called again. It completes only the outstanding parts, instead of returning `"Order already refunded"`.
> 6. Calling the refund twice, or retrying after a partial failure, never refunds the payment more than once.
> 7. Refunding a single-parcel order behaves exactly as before.
> 8. A successful refund publishes one `ORDER_REFUNDED` event per order.
>
> **Engineering guidance**
> Reverse every parcel on the order, fail the refund when any part of it fails, and make a retry finish only the parts still outstanding without refunding the payment again.
>
> Repository `billing-api`, file `RefundService.ts`, method `refundOrder`. The older `billing-legacy` repository does not contain this code.
>
> Cause, read in code:
> - Line 112 reads `order.shipments[0]` instead of looping over every shipment.
> - Line 131 combines the two outcomes with `||`, so a failed ledger write is masked by a successful payment refund.
> - Line 127 commits the payment refund before the ledger write, which runs outside the transaction.
>
> - Line 140 rejects any second call once the order is marked refunded, so a half-finished refund cannot be completed.
>
> Must not change: `ORDER_REFUNDED` publishing, and single-parcel orders.
>
> ```ts
> // Current — line 131
> ok = paymentOk || ledgerOk;
>
> // Proposed
> ok = paymentOk && ledgerOk;
> ```
>
> Covers criteria 3 and 4 only. It does not make a retry safe: the payment refund at line 127 may already have succeeded.
>
> For criteria 5 and 6:
> - Record each step's completion (payment refunded, each parcel reversed) against the refund id.
> - On retry, skip the steps already recorded.
> - Send the refund id to the payment provider as its idempotency key, so a repeated call cannot refund twice even if the record write failed.
>
> Criteria 1 and 2 need the loop at line 112.
>
> **Evidence**
> - Read in code: lines 112, 127, 131 and 140 of `RefundService.ts`.
> - Queried: split-shipment orders were 3.1% of all refunded orders last month (402 of 12,950). This is exposure, not the number of refunds affected — the affected count is unknown.
> - Inferred from code, not observed: the queued email behaviour. No call to the email queue exists in this path. Refunding a split order in staging would confirm it.

## Publishing to the tracker

Only when asked. General rules:

- Use the tracker's native rich format when the connector offers one. Converting through markdown or wiki markup tends to break code blocks and tables.
- Send attachments in their own call, separate from the description, if the connector takes them separately.
- Put priority and labels in the tracker's own fields, not in the description.
- Re-read the ticket after writing. Check the code blocks, the table shape, and that every reference still earns its place.
- If a stale attachment cannot be deleted through the connector, say so.

**Jira, if your connector supports ADF:** follow that connector's own schema. For example, the Atlassian Rovo connector takes `contentFormat: "adf"`; a text node's `marks` is a flat array, and nesting `marks` inside a mark is rejected. Markdown descriptions that round-trip through wiki markup tend to corrupt code blocks and tables.

## Final check

- A developer can identify the complete change without reading another conversation.
- QA can pass or fail from the acceptance criteria alone.
- Title, Scope, Engineering guidance and Acceptance criteria describe the same outcome.
- Every must-not-change in Scope has a regression criterion.
- Blocking decisions are visible.
- Every factual claim says how it is known.
- No invented evidence, no filled-for-the-sake-of-it sections.
- Nothing copied from the worked example.
- Personal attribution, conversation history and unrelated work are gone.
- Bullets not walls. Chronological where order matters. Plain words. Nothing longer than it needs to be.
