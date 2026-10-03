---
name: comment-hygiene
description: Review the entire codebase and keep comments brief, simple, factual, and self-contained. Remove stale claims, cross-references, and AI conversation residue without changing behavior.
---

# Comment Hygiene

## Purpose

- Keep comments useful for understanding and debugging code.
- Explain non-obvious reasons, constraints, and edge cases.
- Make each comment understandable on its own.
- Avoid describing what readable code already explains.

## Review scope

- Review all first-party source code, tests, scripts, and configuration.
- Exclude generated files, dependencies, vendor code, and build output.
- Follow repository instructions and existing language conventions.
- Work in batches when necessary and track coverage.
- Never claim a complete review when files remain unchecked.
- Apply clear comment fixes unless the user requests an audit only.

## Remove

- Comments that repeat the code or duplicate other explanations.
- Decorative banners and unnecessary headings.
- Conversation history: “I told Claude,” “the user requested,” “she said,” and “as discussed.”
- Assistant apologies, self-references, and implementation diaries.
- Unsupported descriptions such as “robust,” “secure,” or “production-ready.”
- Cross-references such as “see above,” “see the other service,” or “refer to the document.”
- Evidence numbers, citation markers, source line numbers, and investigation identifiers.
- Historical counts, sample record IDs, and snapshot values from previous investigations.
- Commented-out code with no remaining explanatory purpose.
- Obsolete claims and completed TODOs when their resolution is verified.

## Preserve

- Non-obvious intent, business constraints, invariants, and edge cases.
- Verified reasons for workarounds.
- Unresolved TODOs with a clear description of the remaining work.
- Actual domain constants, protocol numbers, and error codes needed to explain behavior.
- Required API documentation, licenses, copyright, and attribution.
- Compiler, linter, coverage, build, and other tool-consumed directives.
- Legitimate descriptions of AI functionality.

## Self-contained comments

- State the relevant behavior, reason, or constraint directly.
- Never require the reader to open another file, document, ticket, or conversation to understand the explanation.
- Replace cross-references with the minimum verified explanation needed locally.
- Mention another component only when necessary to explain the interaction; describe its relevant behavior in the same comment.
- Keep a Jira ID only as optional tracking metadata when useful. The comment must remain complete and understandable if the ID is removed.
- Preserve legally required references and functional documentation directives.

## Evidence rules

- Verify claims against the implementation, relevant callers, tests, and configuration.
- Use evidence to establish accuracy; do not embed investigation references in comments.
- Do not invent business intent from implementation alone.
- Do not treat configuration as proof of production behavior.
- Leave consequential claims unchanged and flag them when accuracy cannot be established.
- Do not remove TODOs merely because they are old.

## Writing style

- Use plain language and direct statements.
- Prefer one concise sentence, usually one or two lines.
- Use short bullets for several distinct constraints or cases.
- Avoid nested lists and long paragraphs.
- Explain **why** when the **what** is already clear.
- Follow existing language and documentation conventions.
- Do not force labels or add comments to every function.
- Preserve essential detail when shortening would change meaning.

## Example

When verified:

```text
Before:
See the vendor integration notes and the earlier discussion
for why we added this workaround.

After:
Omit empty arrays because the vendor rejects them.
```

## Execution safeguards

- Change comments only.
- Preserve program behavior and unrelated user edits.
- Avoid blanket keyword or regex deletion.
- Treat docstrings, executable examples, and tool-consumed comments as potentially functional.
- Report discovered code defects separately.
- Review the final diff.
- Run repository-required checks and relevant targeted checks.
- Leave already clear comments unchanged on subsequent runs.
- Do not commit, push, or create a schedule unless requested.

## Completion report

- Files reviewed and changed.
- Main cleanup categories.
- Uncertain claims requiring attention.
- Excluded or unfinished scope.
- Checks performed and verification limits.