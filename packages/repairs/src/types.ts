/**
 * One transcribed turn. `speaker` is whatever label the transcription source
 * assigned (for Bee: "speaker_1", "speaker_2", ...). Ids are opaque and unique
 * within a conversation.
 */
export interface Utterance {
  id: string;
  speaker: string;
  text: string;
  /** Epoch milliseconds. */
  ts: number;
}

export interface Transcript {
  conversationId: string;
  utterances: Utterance[];
}

/**
 * The four repair patterns. Letters match the product requirements (LUG-201).
 *
 * - `initiator`       (a) another speaker signals non-understanding right after the wearer
 * - `rephrase`        (b) the wearer restates the same content within two turns
 * - `self-correction` (c) the wearer corrects mid-turn ("I mean", "sorry,", "no,")
 * - `restart`         (d) the wearer abandons a sentence and restarts it simpler
 */
export type RepairPattern = "initiator" | "rephrase" | "self-correction" | "restart";

/**
 * A flagged moment. Contains only the wearer's utterance ids and text.
 * Other speakers' words are never present in this structure, in `evidence`
 * included. That is a tested property of the library, not a convention.
 */
export interface RepairMoment {
  pattern: RepairPattern;
  conversationId: string;
  /** Ids of the wearer utterances involved, in transcript order. */
  wearerUtteranceIds: string[];
  /** The wearer's exact words for the primary utterance (the one the lesson is about). */
  wearerText: string;
  /** Timestamp of the primary utterance. */
  ts: number;
  /** Pattern-specific, wearer-only detail. */
  evidence: RepairEvidence;
}

export type RepairEvidence =
  | { pattern: "initiator"; initiatorSeen: true }
  | { pattern: "rephrase"; restatementId: string; overlap: number }
  | { pattern: "self-correction"; marker: string; correctedText: string }
  | { pattern: "restart"; restartId: string; overlap: number };

export interface DetectOptions {
  /** The speaker label that identifies the wearer. Required. */
  wearerSpeaker: string;
  /** Minimum lexical overlap (0..1) for rephrase and restart. Default 0.5. */
  overlapThreshold?: number;
}
