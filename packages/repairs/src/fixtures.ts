import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { RepairPattern, Transcript } from "./types.js";

/** Shape of a file in fixtures/repairs/. See fixtures/repairs/README.md. */
export interface Fixture {
  name: string;
  description: string;
  patterns: RepairPattern[];
  wearerSpeaker: string;
  transcript: Transcript;
  expected: { pattern: RepairPattern; wearerUtteranceIds: string[] }[];
}

export const PATTERNS: readonly RepairPattern[] = ["initiator", "rephrase", "self-correction", "restart"];

/** Fixtures live at the repository root so the public repo can carry them unchanged. */
export function fixturesDir(): string {
  return join(import.meta.dirname, "..", "..", "..", "fixtures", "repairs");
}

export function loadFixtures(dir = fixturesDir()): Fixture[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
    .sort()
    .map((f) => JSON.parse(readFileSync(join(dir, f), "utf8")) as Fixture);
}
