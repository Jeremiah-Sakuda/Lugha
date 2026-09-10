# repairs fixtures

**Every transcript in this directory is synthetic.** They were written by hand to exercise the detector and are used only by the unit tests. They are not recordings, they are not from any wearer, and no number derived from them appears in FINDINGS.md (INV-5). They contain lines for other speakers because the detector has to see those lines to decide pattern (a); the detector's output is tested to contain none of them (INV-1).

## Format

One JSON file per scenario:

```json
{
  "name": "initiator-sorry",
  "description": "Other speaker says 'sorry?' right after the wearer.",
  "patterns": ["initiator"],
  "wearerSpeaker": "speaker_1",
  "transcript": {
    "conversationId": "fx-initiator-sorry",
    "utterances": [
      { "id": "u1", "speaker": "speaker_1", "text": "I go to the doctor yesterday.", "ts": 1000 },
      { "id": "u2", "speaker": "speaker_2", "text": "Sorry?", "ts": 2000 }
    ]
  },
  "expected": [
    { "pattern": "initiator", "wearerUtteranceIds": ["u1"] }
  ]
}
```

- `patterns` lists which detector patterns the fixture exercises. The test runner compares `expected` only once every listed pattern is implemented, so fixtures can be written ahead of the code.
- `expected` is matched on `pattern` and `wearerUtteranceIds` only. An empty `expected` is a negative fixture: the detector must flag nothing.
- Timestamps are epoch milliseconds and only need to increase.
