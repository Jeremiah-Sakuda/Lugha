# Decisions

Each decision records the options, the choice, the date, and what it unblocks. Closed decisions are not reopened without a new entry.

| ID | Decision | Due | Status | Choice |
|---|---|---|---|---|
| D1 | Delivery surface | Sept 14 | **Proposed** (close in Sprint 0) | iPhone PWA + Web Push, mirrored to the watch |
| D2 | The learner | Sept 17 (fallback trigger Sept 21) | Open | — |
| D3 | Conversation-close event | Sept 14 | **Proposed** (verify in LUG-101) | `update-conversation` with `state: "processed"` |
| D4 | Stack | Sept 10 | Closed | TypeScript monorepo, see below |
| D5 | Where the ledger lives | Sept 10 | Closed | Insert-only Postgres table behind the web app |
| D6 | LLM provider | Sept 22 | Open | One provider behind an adapter; env-selected |

## D1 Delivery surface: iPhone PWA + Web Push (proposed)

**Options.** (A) watchOS companion app with iOS host. (B) Native iOS app with rich notifications. (C) Installed web app (PWA) on the iPhone using Web Push.

**Choice: C.** Reasons:

- iOS mirrors phone notifications to a worn Apple Watch when the phone is locked. The wrist buzz in demo beat 3 happens without a watch target. (Verify on day one; record in BUILD-LOG.)
- No App Store, TestFlight, or provisioning-profile time. The learner installs by "Add to Home Screen".
- The UI is one web codebase, which is what the design skill targets.
- Deviation from LUG-501 to note in README: iOS Web Push does not render action buttons on the banner. The three actions live on the lesson card, which opens on tap. This still satisfies LUG-304.

**Reopen if:** Web Push does not arrive reliably on the learner's phone during Sprint 3 testing. Fallback is (B), and only the lesson card screen is rebuilt.

## D2 The learner (open)

Owner: you. Written consent template lives at [CONSENT-TEMPLATE.md](CONSENT-TEMPLATE.md); signed forms stay out of the repo. The learner should start wearing Bee the day D2 closes, even before the pipeline exists; Lugha backfills from Bee's conversation history when the service comes up (commit C2.13). If nobody is secured by Sept 21, switch to scripted-but-real conversations and label them in README and video (INV-5).

## D3 Conversation-close event: `update-conversation` / `processed` (proposed)

The Bee CLI's stream documents these events: `new-conversation` (payload `conversation.state: "processing"`), `new-utterance` (payload `utterance.text`, `utterance.speaker`, `conversation_uuid`), and `update-conversation` (payload `conversation.state: "processed"`). The close signal is the first `update-conversation` for a conversation whose state is `processed`.

Verify during LUG-101: how long after the last utterance it arrives, and whether `new-utterance` uses `conversation_uuid` while `update-conversation` uses numeric `id` (the docs suggest both; the service will need a uuid-to-id map from `new-conversation`). If the event never arrives for short conversations, the silence timeout (commit C2.4) closes the window and the friction log gets an entry.

## D4 Stack (closed)

- **Language.** TypeScript everywhere. Node 22. pnpm workspaces.
- **`packages/repairs`.** Zero-dependency library. Vitest. Extracted to its own public repo in Sprint 5 with `git subtree split`, so its commit history stays intact and in-window.
- **`apps/service`.** Long-running Node process on the build Mac (it needs the `bee` login). Imports `@beeai/cli/lib` and subscribes to the stream at startup (LUG-102). Runs `repairs`, the classifier, and the lesson writer. Posts to the web app's ingest endpoint. Reads Bee MCP over stdio for weekly day context.
- **`apps/web`.** Next.js App Router, deployed to Vercel for a stable HTTPS origin. PWA with Web Push. Holds the ledger and push subscriptions in Postgres (Neon via the Vercel Marketplace) with Drizzle.
- **LLM calls.** Through the `ai` SDK with the provider chosen by env (D6). Structured output for the classifier, plain text plus a local validator for the lesson.
- **Design.** The UI design skill generates a persisted design system under `design-system/lugha/`. The skill's own files live in a hidden editor directory that the ignore rules exclude (INV-6).

Why a local service plus a hosted web app rather than everything on one machine: the learner's phone must open a lesson from anywhere during the day, and Web Push needs a stable HTTPS origin. Everything Bee-authenticated stays on the Mac.

## D5 Where the ledger lives (closed)

One insert-only table, `ledger_events`, in the web app's database. The application database role has `INSERT` and `SELECT` only; no code path updates or deletes. Every moment, classification, lesson, delivery, and learner action is a row. Views (moments list, weekly insight) are derived by folding the rows. This makes LUG-401 a checkable property rather than a promise (commit C3.16 tests it).

## D6 LLM provider (open until Sprint 2)

Pick one provider on the day the classifier is written. Requirements: structured JSON output, a small fast model is enough, cost is negligible at tens of calls per day. Not a differentiator; do not spend more than an hour on it.
