# AGENTS.md

Working rules for anyone or anything that edits this repository. The invariants below are prohibitions. Code, docs, and commits that violate one are wrong even if they work.

## Invariants (from the PRD, section 4)

- **INV-1 Wearer only.** Do not persist, log, print, or display any utterance that is not the wearer's. Other speakers' text may exist only inside the in-memory window of one open conversation and must be dropped when that window closes. Test fixtures that contain other-speaker lines are synthetic and labeled as such.
- **INV-2 Never interrupt.** Do not send any notification or lesson while the source conversation is open. Delivery is triggered by the conversation-close event or the silence timeout, never by an utterance.
- **INV-3 Evidence, not verdict.** Do not ship a lesson or an insight without a link to the wearer utterance(s) it came from. Do not count a dismissed moment in any learner-model view.
- **INV-4 Deterministic first.** Do not let a language model create a moment. Moments come from `packages/repairs` rules. The model may only classify a flagged moment or write its lesson.
- **INV-5 No fabricated data.** Do not put a synthetic conversation in the demo or a made-up number in FINDINGS.md. Synthetic data is allowed only in unit tests and is labeled synthetic.
- **INV-6 No authoring-tool attribution.** Do not mention any AI assistant or authoring tool anywhere in this repository, its commit messages, its documentation, or the video. Do not commit editor or assistant configuration directories. Commit messages carry no trailers.

## Language rules for user-facing text

- No praise ("great job"), no scores, no percentages of mastery, no "mastered". Counts and dates only.
- Lesson format is fixed: **You said** / **A more natural way** / **Why** / **Try it**. Under forty words total.

## Commit rules

- Conventional Commits: `type(scope): imperative summary`. Types: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. Scopes: `repairs`, `service`, `web`, `build-log`, `friction`, `findings`, `decisions`, `ci`, `readme`.
- One change per commit. A commit that touches two scopes is two commits.
- Every commit that closes a sprint item references it in the body: `Closes LUG-201(a)`.
- No trailers of any kind. No co-author lines.
- Tests run green before a `feat` commit lands.

## Layout

```
packages/repairs   detector library (extracted to its own public repo in Sprint 5)
apps/service       local process: Bee stream -> repairs -> classifier -> ledger
apps/web           Next.js PWA: lesson card, moments, weekly insight, push
docs/              PRD, decisions, sprint plan, logs, findings
fixtures/          synthetic transcripts for tests only
design-system/     persisted design system for the web app
```

## Definitions

- **Moment:** a flagged repair, wearer utterance ids plus pattern type.
- **Lesson:** the four-line card written from one moment.
- **Ledger:** the insert-only event table. Nothing edits or deletes a row.
- **Window:** the in-memory buffer of one open conversation.
