# Lugha sprint plan, down to the commit

**Window:** Thu Sept 10 to Fri Oct 23, 2026 (submission closes 3:00 PM EDT). Six weeks, six sprints plus a three-day buffer.
**Cadence:** one-week sprints, Tuesday to Monday, so each sprint's last day is a Monday review. Sprint 0 is a short one (Thu to Mon).
**Commit rhythm:** small commits, several per working session. Every sprint ends with a build-log commit and a friction-log commit. Commit messages follow [AGENTS.md](../AGENTS.md): Conventional Commits, one scope each, no trailers.

Commit IDs below (`C2.7`) are for cross-reference in this document only; they do not appear in commit messages. Messages are given verbatim. A `feat` commit lands with its tests in the same commit unless a `test` commit is listed right before it.

## Calendar

| Sprint | Dates | Theme | Exit gate |
|---|---|---|---|
| 0 | Thu Sept 10 – Mon Sept 14 | Ground truth | Real utterances from the watch in BUILD-LOG; D1, D3 closed; K1 evaluated |
| 1 | Tue Sept 15 – Mon Sept 21 | The `repairs` library | Four patterns pass fixtures; D2 closed; learner is wearing Bee |
| 2 | Tue Sept 22 – Mon Sept 28 | The pipeline | One real conversation produces a ledger row with a lesson, end to end |
| 3 | Tue Sept 29 – Mon Oct 5 | Wrist and phone | A lesson arrives on the learner's actual phone (and watch) after a real conversation; weekly insight renders |
| 4 | Tue Oct 6 – Mon Oct 12 | Demo week | Seven days of real data; FINDINGS numbers filled; precision labeled |
| 5 | Tue Oct 13 – Mon Oct 19 | Ship | `repairs` public repo live; README, diagram, feedback, video cut |
| 6 | Tue Oct 20 – Fri Oct 23 | Buffer and submit | Devpost form submitted by Thu Oct 22, 6 PM |

Working assumption: one builder, roughly three focused hours on weekdays and longer sessions on weekends. If more time is available, pull Sprint 3's device commits earlier; the demo-week start (Oct 6) is the date that must not slip because the weekly insight needs seven real days before the video is cut.

## Cut order

If the schedule slips, cut from the top of this list first. Each cut gets a one-line note in BUILD-LOG and README.

1. LUG-305, first-language Why line (C3.13)
2. Agent Skill at runtime (C3.12); keep it as a development tool and report on it honestly in the feedback
3. MCP day context in the weekly insight (C3.10)
4. Backfill from Bee history on restart (C2.13)
5. Silence-timeout fallback (C2.4), only if D3's event proves reliable
6. Practice-later queue view (C3.6 keeps the action, drops the dedicated list)

Never cut: the runtime stream subscription, the four detector patterns with tests, the four-line lesson, the three actions, the insert-only ledger, the public `repairs` repo, any of the LUG-700 documents.

---

## Sprint 0: Ground truth (Sept 10–14)

**Goal.** Prove the capture path on the real watch before writing product code. Close D1 and D3. Evaluate K1.

**Prerequisites you do by hand (not commits):** update the Bee app; enable Developer Mode by tapping the version number five times in Settings; put the watch on. Install the CLI: `npm install -g @beeai/cli` then `bee login`. Install the UI design skill: `npm install -g ui-ux-pro-max-cli` then `uipro init --ai <your-editor>` in the repo (it writes into a hidden editor directory, which the ignore rules exclude).

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C0.1 | `chore: initialize repository with license and ignore rules` | LICENSE (MIT), .gitignore, .nvmrc, .editorconfig | License renders in GitHub's About box |
| C0.2 | `docs: add product requirements v1.0` | docs/PRD.md | — |
| C0.3 | `docs: add working rules with invariants as prohibitions` | AGENTS.md | — |
| C0.4 | `docs: add decisions register` | docs/DECISIONS.md, docs/CONSENT-TEMPLATE.md | — |
| C0.5 | `docs: add sprint plan down to the commit` | docs/SPRINTS.md | — |
| C0.6 | `docs: scaffold readme, build log, friction log, findings` | README.md, BUILD-LOG.md, FRICTION-LOG.md, FINDINGS.md | — |
| C0.7 | `chore: bootstrap pnpm workspace with typescript and vitest` | package.json, pnpm-workspace.yaml, tsconfig.base.json, vitest.workspace.ts, empty `packages/` and `apps/` | `pnpm install && pnpm test` exits 0 with zero tests |
| C0.8 | `chore(ci): run tests on every push` | .github/workflows/ci.yml (pnpm, Node 22, `pnpm test`) | Green check on GitHub |
| C0.9 | `chore: add bee doctor script` | scripts/bee-doctor.ts: prints `bee version`, `bee status`, `bee ping`, and the Developer Mode reminder | Script output pasted into BUILD-LOG |
| C0.10 | `docs(build-log): day one capture from the watch` | Raw output of `bee stream --json --types new-utterance,new-conversation,update-conversation` during one real conversation, and `bee sync --only conversations` for the same conversation. **Redact every non-wearer line** before pasting (INV-1). Note the speaker label Bee assigned to the wearer. | LUG-101 AC |
| C0.11 | `docs(decisions): close d3 conversation close event` | Which event closed the conversation, seconds after the last utterance, whether uuid and numeric id both appear | LUG-104 |
| C0.12 | `docs(decisions): close d1 delivery surface` | Result of the day-one test: does a phone notification mirror to the worn watch? | LUG-501 |
| C0.13 | `docs(friction): setup and stream entries` | One entry per real friction from install, login, Developer Mode, stream, sync | Rules bonus |
| C0.14 | `docs: add design system for the web app` | design-system/lugha/MASTER.md from the skill (`--design-system --persist -p "Lugha"`), reviewed by hand; strip any line naming the generator | INV-6 grep clean |
| C0.15 | `docs(build-log): sprint 0 review and k1 decision` | K1: did the stream deliver usable utterances from the watch? If not, the plan flips to sync-only and C2.2 becomes a poller | Gate |

**Exit gate.** C0.10 exists with real utterances. D1 and D3 closed. K1 answered.

---

## Sprint 1: The `repairs` library (Sept 15–21)

**Goal.** A tested, dependency-free detector for the four patterns, plus the honest boundary of what it stores. Close D2 and get the watch on the learner.

**Package shape.** `packages/repairs/src/{types,normalize,overlap,patterns/{initiator,rephrase,selfCorrection,restart},dedupe,redact,index}.ts`, tests beside each file, fixtures under `fixtures/repairs/*.json` (synthetic, labeled).

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C1.1 | `feat(repairs): scaffold package with public types` | `Utterance {id, speaker, text, ts}`, `Transcript`, `RepairMoment {pattern, conversationId, wearerUtteranceIds, wearerText, ts, evidence}`, `detectRepairs(transcript, {wearerSpeaker})` returning `[]` | `pnpm -F repairs test` green |
| C1.2 | `test(repairs): add synthetic fixture format and loader` | fixtures/repairs/README.md stating fixtures are synthetic and used for tests only; `_schema.json`; loader that runs every fixture against `expected` | Table-driven test skeleton |
| C1.3 | `feat(repairs): normalize utterances for comparison` | lowercase, strip punctuation, drop fillers ("um", "uh", "like"), collapse whitespace; tests | Unit tests |
| C1.4 | `feat(repairs): detect other-speaker repair initiators` | Pattern (a). Initiator list as data; must directly follow a wearer utterance; window of one turn | 6+ fixtures incl. negatives ("sorry, go ahead" is not an initiator) |
| C1.5 | `feat(repairs): lexical overlap over content tokens` | Jaccard on normalized tokens, stopwords removed; threshold as an option (default 0.5) | Unit tests at boundaries |
| C1.6 | `feat(repairs): detect wearer rephrase within two turns` | Pattern (b). Same speaker, within next two wearer utterances, overlap above threshold, not identical | Fixtures incl. negative (verbatim repeat is a repeat, not a rephrase) |
| C1.7 | `feat(repairs): detect mid-turn self-correction` | Pattern (c). Markers ("I mean", "sorry,", "no,", "wait,") followed by a clause that overlaps the pre-marker clause | Fixtures |
| C1.8 | `feat(repairs): detect abandoned sentence restart` | Pattern (d). Truncated clause (ends mid-phrase, or trailing "…", or under N tokens) followed by a shorter sentence with overlap | Fixtures |
| C1.9 | `feat(repairs): dedupe overlapping moments` | One moment per wearer utterance; keep the strongest pattern by fixed priority a > c > b > d | Fixtures with overlaps |
| C1.10 | `feat(repairs): redact other-speaker text from results` | Output carries only wearer ids and text. `evidence` for (a) is `{initiator: true}` never the other speaker's words. A test walks every output field and asserts no non-wearer token appears | **INV-1 test** |
| C1.11 | `feat(repairs): add command line runner` | `pnpm -F repairs detect fixtures/repairs/example.json --wearer speaker_1` prints moments as JSON | Manual run in BUILD-LOG |
| C1.12 | `docs(repairs): describe the four patterns and why they matter` | packages/repairs/README.md: the patterns, the options, what is and is not stored, and the argument that repair detection is a primitive for conversational wearables | This becomes the public repo README in Sprint 5 |
| C1.13 | `docs(decisions): close d2 learner` | Who, start date, consent signed (form off-repo), first-language noted for LUG-305 | D2 |
| C1.14 | `docs(build-log): speaker label behavior over five real conversations` | For five wearer conversations: label assigned to the wearer, whether it stayed stable, any `Unknown`. Wearer lines only. | K2 input, LUG-103 |
| C1.15 | `docs(friction): sync and label entries` | | |
| C1.16 | `docs(build-log): sprint 1 review` | Fixture count, which patterns look weakest, learner wearing since date | Gate |

**Exit gate.** All four patterns green on fixtures. INV-1 test passes. D2 closed and the learner is wearing Bee daily.

---

## Sprint 2: The pipeline (Sept 22–28)

**Goal.** From a live Bee stream event to a ledger row containing a lesson, with no human in the loop. Runs on the Mac.

**Service shape.** `apps/service/src/{config,log,bee/{stream,window,calibrate,backfill},detect,llm/{adapter,classify,lesson,validate},ledger/client,main}.ts`.

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C2.1 | `feat(service): scaffold service with typed config and logger` | env schema (`LUGHA_API_URL`, `LUGHA_INGEST_SECRET`, `LUGHA_LLM_PROVIDER`, key), `.env.example`, logger that **refuses to log utterance text unless speaker is the wearer** | Unit test on the logger guard |
| C2.2 | `feat(service): subscribe to bee stream at startup` | `import { createBeeClient } from "@beeai/cli/lib"`; `sse.streamJson({types:[...]})`; reconnect with backoff; this is LUG-102 | Runs against the real stream; BUILD-LOG |
| C2.3 | `feat(service): buffer one conversation window and close on processed` | Map uuid to numeric id from `new-conversation`; append utterances; on `update-conversation` with `processed`, hand the window to detection then **clear it** | Unit tests with recorded event sequences (wearer lines only in fixtures) |
| C2.4 | `feat(service): close window on silence timeout` | Configurable (default 8 min) fallback when the close event never arrives; logs which path closed it | Unit test with fake timers |
| C2.5 | `feat(service): calibrate wearer speaker label` | `pnpm -F service calibrate`: wearer reads a fixed phrase, the service watches the stream for it, stores the label in `data/wearer.json`; fallback re-fetches `conversations transcript <id> --json` after close when the live label is `Unknown` | LUG-103; README section later |
| C2.6 | `feat(service): run repairs on closed windows` | Calls `detectRepairs`; keeps only redacted moments; asserts the window buffer is empty afterwards | Test asserts no non-wearer text survives the call |
| C2.7 | `feat(service): llm adapter with provider chosen by env` | `ai` SDK; one function `complete(schema, prompt)`; D6 closed here | Unit test with a fake provider |
| C2.8 | `feat(service): classify moments into pattern categories` | Structured output over the seven categories incl. "not a language issue"; input is the wearer utterance and the pattern only (LUG-302) | Recorded-response tests |
| C2.9 | `feat(service): write four-line lessons with a validator` | Prompt yields the four fields; validator enforces: ≤40 words, You-said quotes the wearer text verbatim, no praise words, no numbers that look like scores; retries once then drops the moment with a log line | Validator unit tests incl. rejection cases |
| C2.10 | `feat(web): scaffold next.js app with insert-only ledger schema` | apps/web with Drizzle; `ledger_events(id, ts, conversation_id, type, payload)`, `push_subscriptions`; migration grants the app role INSERT and SELECT only | Migration applies; a manual `UPDATE` as the app role fails |
| C2.11 | `feat(web): ingest endpoint with bearer secret` | `POST /api/ledger` validates payload by event type and inserts; rejects unknown types | Route tests |
| C2.12 | `feat(service): post moments and lessons to the ledger` | Event types `moment.flagged`, `moment.classified`, `lesson.written`; idempotency key = conversation id + utterance id + type | Integration test against a local database |
| C2.13 | `feat(service): backfill processed conversations on startup` | Uses `bee changed --cursor` and `conversations transcript`; replays through the same window code; cursor stored locally | Run against the learner's history since D2; BUILD-LOG |
| C2.14 | `chore(service): launchd agent and keepawake script` | `scripts/lugha.plist`, `scripts/keepawake.sh` (caffeinate) so the Mac runs the service through demo week | Documented restart procedure |
| C2.15 | `docs(build-log): first real conversation end to end` | Stream event → moment → category → lesson → ledger row, with timestamps, wearer lines only | **Sprint gate** |
| C2.16 | `docs(friction): stream, close event, transcript entries` | | |
| C2.17 | `docs(build-log): sprint 2 review` | | |

**Exit gate.** C2.15 with a real conversation. The service survives a laptop sleep and reconnects.

---

## Sprint 3: Wrist and phone (Sept 29–Oct 5)

**Goal.** The learner's phone shows the lesson after a real conversation. The weekly insight exists. Everything the video needs is on a device.

**Web shape.** `apps/web/app/{page,lesson/[id],moments,insight,settings}`, `app/api/{ledger,push,actions}`, `public/sw.js`, `lib/{db,fold,push}`. Design tokens come from `design-system/lugha/MASTER.md`.

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C3.1 | `feat(web): pwa manifest and service worker` | Installable; standalone display; icon set | Installed on the learner's iPhone |
| C3.2 | `feat(web): web push subscription with vapid keys` | Subscribe flow on first open; keys in env; `push_subscriptions` insert | Test push received on the phone |
| C3.3 | `feat(web): notify once per closed conversation` | On ingest of the last `lesson.written` for a conversation (service sends a `conversation.lessons_ready` event), send one push: "1 learning moment from your last conversation" / "N learning moments…"; never on `moment.flagged` (INV-2) | Test: N lessons → exactly one push |
| C3.4 | `feat(web): lesson card` | The four lines in fixed order, wearer words at top, nothing else on screen | Design checklist from the skill |
| C3.5 | `feat(web): got it, practice later, not a mistake actions` | Each appends `action.*` to the ledger; the card advances to the next lesson from the same conversation | Route tests; INV-3 |
| C3.6 | `feat(web): moments list with evidence links` | Every lesson and insight line links to its wearer utterance(s) by id | INV-3 |
| C3.7 | `feat(web): fold ledger into learner model excluding dismissed` | Pure function `fold(events)` → moments by category by week, dismissed excluded, tested in isolation | Unit tests |
| C3.8 | `feat(web): show not-a-language-issue moments only on opt-in` | Settings toggle, default off | LUG-204 |
| C3.9 | `feat(service): weekly insight from ledger counts` | Counts per category this week vs last, "new", "down from", "not seen since <date>" after 14 days; never a percentage or the word "mastered"; posts `insight.weekly` | Unit tests over synthetic ledgers; a lint test greps the output for banned words |
| C3.10 | `feat(service): read bee mcp for day context` | MCP client over stdio to `bee mcp serve`; calls the daily-summary tool for each day in the week; adds one line of where/when context; **read-only** | Runs against the real MCP; BUILD-LOG |
| C3.11 | `feat(web): weekly insight page` | Counts with each line tappable to its moments | LUG-402 |
| C3.12 | `feat(service): use the bee agent skill as insight context` | Install `npx skills add bee-computer/bee-skill`; the insight step loads the skill's instructions as the system context for phrasing the day-context line, so the skill is used at runtime, not just in development. If this takes more than half a day, cut and record honestly in feedback. | Cut-order item 2 |
| C3.13 | `feat(web): why line in the wearer's first language` | Only if D2's learner set one and it costs under a day (LUG-305) | Cut-order item 1 |
| C3.14 | `chore(web): deploy to production and record the url` | Production deploy; URL in README; `LUGHA_API_URL` set in the service | Phone opens it |
| C3.15 | `test(web): ledger has no update or delete code path` | Static test: no `update(`/`delete(` on the ledger table anywhere in apps/web; plus a live test that the app role cannot update | INV-1/LUG-401 |
| C3.16 | `docs(build-log): lesson delivered to the phone and watch after a real conversation` | Timestamps: close event, push sent, push received, opened. Photo or screen recording saved for the video (off-repo) | **LUG-502 gate** |
| C3.17 | `docs(friction): mcp and skill entries` | | |
| C3.18 | `docs(build-log): sprint 3 review` | | |

**Exit gate.** C3.16. The learner has used the card at least once unprompted.

---

## Sprint 4: Demo week (Oct 6–12)

**Goal.** Seven consecutive real days. Measure everything FINDINGS promises. Fix only what the data says to fix.

**Rule for the week:** the detector's thresholds and initiator lists may change, but every change is a commit with a before/after count in its body.

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C4.1 | `feat(scripts): labeling tool for detector precision` | Shows the wearer each flagged moment (own words + pattern) and records confirm/reject to `eval/` (ignored); prints per-pattern precision | Used daily |
| C4.2–C4.8 | `docs(build-log): demo week day N` | One per day: conversations, flagged, confirmed, dismissed, delivery latency, any outage | Seven commits |
| C4.9 | `fix(repairs): <what the data showed>` | Reserved. Expect two to four of these (e.g. an initiator that fires on "sorry, go ahead"; overlap threshold too low on short utterances). Each carries before/after precision in the body | Fixture added for each |
| C4.10 | `fix(service): <what the week showed>` | Reserved (reconnects, close-event timing, backfill duplicates) | |
| C4.11 | `docs(findings): detector precision by pattern` | Table 1 filled from the labeling tool | |
| C4.12 | `docs(findings): moments per day and category distribution` | Tables 2 and 3 | |
| C4.13 | `docs(findings): speaker label reliability` | Section 4, K2 answer | |
| C4.14 | `docs(findings): conversation close latency` | Section 6 | |
| C4.15 | `feat(web): polish against the design checklist` | Spacing, contrast, tap targets, dark mode, from the skill's pre-delivery list | Checklist in commit body |
| C4.16 | `docs(friction): demo week entries` | | |
| C4.17 | `docs(build-log): sprint 4 review` | | |

**Exit gate.** FINDINGS sections 1–4 and 6 filled with measured numbers. At least one conversation on video (consented) where the whole loop happened.

---

## Sprint 5: Ship (Oct 13–19)

**Goal.** Public `repairs` repo, complete documentation, feedback, video.

| # | Commit message | Contents | Verified by |
|---|---|---|---|
| C5.1 | `chore(repairs): prepare package for standalone publication` | package.json name, description, repository, keywords, `files`; LICENSE copied into the package; CHANGELOG.md | `npm pack` lists only intended files |
| C5.2 | *(new repo)* `git subtree split -P packages/repairs -b repairs-public` then push to a **new** public repo `Jeremiah-Sakuda/repairs` created that day, MIT, description set. Add a CI workflow there in its own first commit: `chore(ci): run tests on push` | History shows in-window commits | LUG-601 |
| C5.3 | `docs(readme): link the public repairs repository` | Monorepo README points at the canonical public repo and states the monorepo mirrors it by subtree | |
| C5.4 | `docs(readme): setup, run, calibration` | Install CLI, Developer Mode, login, env, database, deploy, calibrate, run, restart procedure | A second machine could follow it |
| C5.5 | `docs: architecture diagram` | docs/architecture.svg plus the same as a Mermaid block in README; each hop labeled with the Bee surface used | Renders on GitHub |
| C5.6 | `docs(findings): learner model observations` | Section 5 in counts and examples | |
| C5.7 | `docs: product feedback per bee surface` | docs/PRODUCT-FEEDBACK.md with five sections (CLI, stream, sync, MCP, Skill), each answering the five rules questions | LUG-702 |
| C5.8 | `docs: feature requests with priorities` | docs/FEATURE-REQUESTS.md, Critical/Important/Nice-to-have | Rules optional bonus |
| C5.9 | `docs: submission text and open source mini fields` | docs/SUBMISSION.md: description, how it works, why it matters, contribution URL, repo URL, username | LUG-602 |
| C5.10 | `docs: video shot list` | docs/VIDEO.md from PRD section 7 with the real conversation chosen, captions, and which screen recording covers each beat | Shoot Wed Oct 14–Thu Oct 15; cut Fri–Sat; upload Sun Oct 18 |
| C5.11 | `chore: invariant audit script` | scripts/audit.sh: greps repo and `git log` for authoring-tool names, "mastered", "score", percentages in user-facing strings; fails CI on a hit | Green |
| C5.12 | `docs(build-log): video published` | Public link, length, checklist: no third-party marks, no music without rights | |
| C5.13 | `docs(friction): final entries` | | |
| C5.14 | `docs(build-log): sprint 5 review` | | |

**Exit gate.** Every item in PRD section 12 checked except the form itself.

---

## Sprint 6: Buffer and submit (Oct 20–23)

| # | Commit message | Contents |
|---|---|---|
| C6.1 | `chore: freeze for submission` | Tag `v1.0.0`; README Status line updated |
| C6.2 | `docs: submission checklist complete` | PRD section 12 all checked, with links |

**Hard dates.** Code freeze Tue Oct 20. Devpost form filled and saved Wed Oct 21. Submit Thu Oct 22 by 6 PM. Fri Oct 23 is for nothing but reading the confirmation email.

---

## Daily rhythm

1. `pnpm test` before opening anything else.
2. Work the sprint's next commit. Commit as soon as its "verified by" holds.
3. Anything Bee did that surprised you goes in FRICTION-LOG the same day.
4. Last fifteen minutes: BUILD-LOG entry, push.

## What each Bee surface is used for (for the feedback answer)

| Surface | Used by | Commit |
|---|---|---|
| CLI (`bee login`, `bee status`, `conversations transcript`) | calibration, fallback transcript fetch, backfill | C2.5, C2.13 |
| Stream (`@beeai/cli/lib` SSE) | live capture, conversation boundaries | C2.2, C2.3 |
| Sync (`bee sync`, `bee changed`) | day-one verification, backfill cursor | C0.10, C2.13 |
| MCP (`bee mcp serve`, daily summary tool) | weekly insight day context | C3.10 |
| Agent Skill (`bee-skill`) | insight phrasing context at runtime; development | C3.12 |
