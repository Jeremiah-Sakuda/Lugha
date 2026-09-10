# Lugha PRD v1.0

**Track:** Bee (Wearable AI), Education priority
**Mini challenge:** Open Source
**Deadline:** Oct 23, 2026, 3:00 PM EDT (12:00 PM PT per Devpost rules)
**Status:** Scope locked for Sprint 0. Decisions D1 and D2 tracked in [DECISIONS.md](DECISIONS.md).

---

## 1. One line

Lugha turns the English you struggled with today into the lesson you remember tomorrow.

## 2. Problem and user

Adult immigrants learning English mostly learn it by living in it: at work, at the clinic, at their kids' school. Language apps teach from a curriculum that never saw those conversations. The learner's real gaps go unnamed and repeat for years.

**User:** one adult English learner who wears Bee (on Apple Watch) through an ordinary day. They are not a student; they have no time for classes. They want to be understood the first time.

**What Lugha does:** listens for moments where communication broke and was repaired, turns the learner's own words into a thirty-second lesson delivered later on the wrist, and over weeks builds a picture of which patterns are improving and which keep recurring.

## 3. Non-goals (v1)

- Correcting grammar in real time or during a conversation
- Coaching anyone other than the wearer
- Pronunciation, prosody, or emotion detection (Bee exposes text, not audio features)
- Curriculum, streaks, gamification, or scores
- Multi-device orchestration (Bee + Fire TV). One sentence of future direction in the pitch, nothing built.
- Letting other users connect their Bee (not required by the rules)

## 4. Invariants

Named, numbered, and quoted in AGENTS.md as prohibitions.

- **INV-1 Wearer only.** Only the wearer's own utterances are ever stored, displayed, or turned into lessons. Other speakers' utterances may be read inside a bounded detection window (the current conversation) and are discarded at the end of that window. They are never persisted, logged, or shown.
- **INV-2 Never interrupt.** No lesson is delivered while the source conversation is still open. Delivery happens after the conversation closes, batched.
- **INV-3 Evidence, not verdict.** Every lesson and every weekly insight links to the specific utterances it came from. Lugha shows the moment; the learner decides whether it was a mistake. A dismissed moment ("that's how I say it") is excluded from the learner model.
- **INV-4 Deterministic first.** Repair moments are detected by rules over the transcript. A language model may confirm, categorize, or write the lesson. It may not originate a learning moment the rules did not flag.
- **INV-5 No fabricated data.** Every conversation in the demo and every number in FINDINGS.md comes from a real wearer, a real device, and real days. Scripted-but-real conversations (consenting people, disclosed recording) are permitted and labeled as such.
- **INV-6 No authoring-tool attribution.** No mention of any AI assistant or authoring tool anywhere in the repo, commits, docs, or video.

## 5. Requirements

### Capture (LUG-100)

- **LUG-101** Bee runs on the wearer's Apple Watch with Developer Mode enabled in the Bee app. The CLI is authenticated on the build machine.
  *AC:* `bee stream --json --types new-utterance` prints live utterances from a real conversation, and `bee sync --only conversations` exports the same conversation as a transcript with speaker labels. Both captured to BUILD-LOG.md on day one.
- **LUG-102** The runtime hook is in code: the Lugha service subscribes to the Bee stream (or polls the sync feed) at startup. This is an import and an entry point, not a README mention (rules requirement for Bee).
- **LUG-103** Wearer identification. A one-time calibration maps Bee's speaker label to the wearer. If labels arrive as `Unknown`, the service falls back to the completed conversation transcript after close, where labels are more reliable.
  *AC:* Documented in README; the `Unknown` case is a friction log entry with severity and workaround.
- **LUG-104** Conversation boundaries come from Bee's own conversation events (verify the event name for conversation close during LUG-101). INV-2 keys off this event.

### Repair detection (LUG-200)

- **LUG-201** A repair moment is flagged when, within a conversation, one of these patterns occurs:
  (a) another speaker produces a repair initiator ("sorry?", "what?", "pardon?", "could you repeat that", "what do you mean", "I don't follow") immediately after a wearer utterance;
  (b) the wearer restates the same content within the next two utterances with high lexical overlap (rephrase);
  (c) the wearer self-corrects mid-turn ("I mean", "sorry,", "no,") followed by a rephrase;
  (d) the wearer abandons a sentence and restarts it simpler.
- **LUG-202** Detection is a standalone library (`repairs`) with unit tests over hand-labeled transcript fixtures. Precision is reported honestly in FINDINGS.md; no target is set in advance.
- **LUG-203** For each flagged moment, the stored record contains only: conversation id, the wearer's utterance ids and text, the pattern type, timestamp. Other-speaker text is used to decide (a) and then dropped (INV-1).
- **LUG-204** A language-model pass classifies each moment into a pattern category (past tense, articles, question formation, politeness modals, word order, vocabulary gap, or "not a language issue"). "Not a language issue" moments are shown to the learner only if they choose to see them.

### Lessons (LUG-300)

- **LUG-301** Lesson format, fixed: **You said** (wearer's exact words) / **A more natural way** / **Why** (one sentence) / **Try it** (one fill-in prompt). Under forty words total. No praise, no scoring language.
- **LUG-302** The lesson is generated from the wearer's utterance alone plus its category. It must not invent situational context the transcript does not contain.
- **LUG-303** Delivery: after the source conversation closes, one notification per conversation ("1 learning moment from your last conversation"). The learner opens it when they choose.
- **LUG-304** Each lesson has three actions: Got it, Practice later, Not a mistake (dismiss; INV-3).
- **LUG-305** Optional: the **Why** line in the wearer's first language when the wearer sets one. Ship only if it costs under a day; otherwise cut and note.

### Learner model (LUG-400)

- **LUG-401** An append-only ledger of moments, categories, and learner actions. Nothing is ever edited in place.
- **LUG-402** Weekly insight, generated from the ledger, written as counts and examples, never as a score: "This week: 4 past-tense moments (down from 9). Articles: 6 (new). You dismissed 2." Each count links to its moments.
- **LUG-403** Recurrence is the improvement signal. A category that stops appearing over two weeks is reported as "not seen since <date>", not as "mastered".
- **LUG-404** Bee's facts and daily summaries are read through the MCP server to add day context to the weekly insight (where the moments happened, e.g. "most were at work"). Read-only; nothing is written back to Bee.

### Delivery surface (LUG-500)

- **LUG-501** Decision D1 governs. If watchOS: a minimal companion app (iOS host + watchOS target) that shows the lesson card and the three actions on the wrist. If notifications: iPhone rich notifications with the lesson card and actions.
- **LUG-502** Whichever surface ships, the demo must show a lesson arriving after a real conversation on the actual watch or phone, not a mock.

### Open Source mini (LUG-600)

- **LUG-601** The `repairs` library ships as its own public repo, MIT licensed, created during the submission window, with tests and a short README explaining the four patterns and why repair detection is a useful primitive for anyone building on conversational wearables.
- **LUG-602** Submission fields: contribution URL, main repo URL, GitHub username, and a description of what it does, how it works, why it matters.

### Documentation (LUG-700, non-negotiable)

- **LUG-701** README with setup, run, and calibration instructions; architecture diagram; FINDINGS.md (detector precision, moments per day, learner-model observations, all measured); BUILD-LOG.md; friction log with one entry per real friction (task, steps, expected, actual, severity, workaround, suggestion).
- **LUG-702** Product feedback answer covers Bee CLI, stream, sync, MCP, and Agent Skill separately: what each was used for, what worked, what needs work, onboarding, would build again.

## 6. Architecture (plain language)

```
Apple Watch running Bee
      │  (Bee processes audio, produces transcript)
      ▼
bee stream / bee sync  ──►  Lugha service (local machine or small server)
                                 │
                                 ├─ repairs library: flags moments from transcript rules
                                 ├─ classifier: assigns category, writes lesson (LLM)
                                 ├─ ledger: append-only store of wearer-only moments
                                 └─ Bee MCP (read-only): day context for weekly insight
                                 │
                                 ▼
                     Lesson delivered after conversation close
                     (watchOS companion app OR iPhone notification, per D1)
```

The LLM provider is a build decision. Bedrock is acceptable but is not required for the mini (Open Source is Lugha's mini); do not add AWS for its own sake.

## 7. Demo (under 3 minutes)

The video is scored on the same four criteria as the project. Lead with the transformation.

1. **0:00–0:20** The learner, in their own words: one sentence about being asked to repeat themselves. Title: *Lugha. Your life is the curriculum.*
2. **0:20–0:50** A real conversation (disclosed, consented). The other person says "sorry?". The learner rephrases. Nothing happens on the wrist. Caption: *Lugha never interrupts.*
3. **0:50–1:20** Conversation ends. The wrist buzzes: "1 learning moment." The learner opens it. The four-line lesson, their own words at the top.
4. **1:20–1:50** Engineering, visible: the Bee stream event on screen, the `repairs` flag, the ledger entry. Thirty seconds, no code dumps, each hop labeled.
5. **1:50–2:30** One week later: the weekly insight. Counts, not scores. Past tense down, articles new. Each line tappable to its moment.
6. **2:30–2:50** Privacy in one line: only the wearer's words are ever kept. Open-source `repairs` repo on screen.
7. **2:50–3:00** One sentence of future direction.

## 8. Judging map

| Criterion | What earns it |
|---|---|
| Tech Implementation | Live stream + transcript sync + MCP read + Agent Skill, all called at runtime; longitudinal ledger; tested detector library |
| Design | Ambient capture, zero learner effort, never interrupts, wearer-only privacy, four-line lesson |
| Potential Impact | One specific user with a daily recurring problem; audience obviously exists beyond the hackathon |
| Quality of the Idea | Matches the rubric's own examples (on-wrist coaching, real-time, self-improvement, facts and insights) while being an actual product |

## 9. Decisions to close before building

- **D1 Delivery surface.** watchOS companion app vs iPhone notifications. Close by Sept 14. Default if unresolved: iPhone notifications (protects the demo).
- **D2 The learner.** Who wears the watch for the demo week. Must be a real adult English learner who consents in writing to disclosed recording under Massachusetts two-party consent, and whose conversation partners consent for any footage used. Close by Sept 17. If no learner is secured by Sept 21, fall back to scripted-but-real conversations with consenting participants, labeled as such in the video and README (INV-5).
- **D3 Conversation-close event.** Confirm the Bee event that marks a conversation as finished (LUG-104). If none exists, use a silence timeout over the stream and log the friction.

## 10. Kill switches

- **K1** If `bee stream` on the Apple Watch does not deliver usable utterances by Sept 14, switch to sync-only (post-hoc) detection and drop "real-time" from all claims.
- **K2** If speaker labels are unreliable enough that wearer identification fails in more than a small fraction of conversations, the demo uses conversations where the wearer confirms their own lines, and FINDINGS.md reports the rate.
- **K3** If D2 fails entirely, the entry is withdrawn rather than shipped on synthetic conversations.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Bee already ships a feature that resembles lessons | Day-one review of the Bee app's native features; position Lugha on repair detection + longitudinal model + wearer-only privacy, which Bee's todos/facts do not do |
| Recording consent | Written consent, disclosure on camera, stated in README |
| Detector precision is low | Report it honestly; a precise detector over four patterns beats a vague one over twenty |
| watchOS app eats the schedule | D1 default protects the demo; the watch surface is upside, not the core |
| Judges read "learner model" as scoring | Counts and examples only, no scores, no "mastered" (LUG-402, LUG-403) |

## 12. Deliverables checklist

- [ ] Main repo (public, MIT, license visible in About)
- [ ] `repairs` repo (public, MIT, created in-window)
- [ ] README, architecture diagram, FINDINGS.md, BUILD-LOG.md, friction log
- [ ] Demo video (YouTube/Vimeo, public, English, under 3:00, no third-party marks or music)
- [ ] Product feedback per tool
- [ ] Open Source mini fields
- [ ] Consent forms on file (not in repo)
