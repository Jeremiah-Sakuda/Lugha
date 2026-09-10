import type { DetectOptions, RepairMoment, Transcript } from "./types.js";

export type * from "./types.js";

/**
 * Detect repair moments in a transcript.
 *
 * Deterministic: the same transcript and options always produce the same
 * moments. Returns moments in transcript order. Never returns any text that
 * was not spoken by `options.wearerSpeaker`.
 */
export function detectRepairs(transcript: Transcript, options: DetectOptions): RepairMoment[] {
  if (!options.wearerSpeaker) {
    throw new Error("detectRepairs: options.wearerSpeaker is required");
  }
  void transcript;
  return [];
}
