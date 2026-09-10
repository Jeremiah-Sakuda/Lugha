/**
 * Text normalization for comparison. Deterministic and lossy on purpose:
 * lowercase, punctuation removed (apostrophes inside words kept), filler
 * sounds dropped, whitespace collapsed. Used by every pattern, never shown
 * to the learner.
 */

const FILLERS = new Set(["um", "uh", "uhm", "er", "erm", "hmm", "hm", "mm", "ah", "eh"]);

export function normalize(text: string): string {
  return tokens(text).join(" ");
}

export function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^\p{L}\p{N}']+/gu, " ")
    .split(" ")
    .map((t) => t.replace(/^'+|'+$/g, ""))
    .filter((t) => t.length > 0 && !FILLERS.has(t));
}

/** True when the utterance ends without a terminal mark, or trails off. */
export function looksTruncated(raw: string): boolean {
  const t = raw.trim();
  if (t.length === 0) return false;
  if (/(\.\.\.|…|-|–|—)$/.test(t)) return true;
  return !/[.!?]["')\]]*$/.test(t);
}
