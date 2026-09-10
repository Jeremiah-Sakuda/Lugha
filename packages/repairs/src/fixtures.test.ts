import { describe, expect, it } from "vitest";
import { PATTERNS, loadFixtures } from "./fixtures.js";
import { detectRepairs } from "./index.js";

/**
 * Patterns whose detector has landed. A fixture's `expected` is compared only
 * when every pattern it lists is in this set; until then the fixture is just
 * checked for shape. Add a pattern here in the commit that implements it.
 */
const IMPLEMENTED = new Set<string>([]);

const fixtures = loadFixtures();

describe("fixtures", () => {
  it("has at least one fixture", () => {
    expect(fixtures.length).toBeGreaterThan(0);
  });

  describe.each(fixtures.map((f) => [f.name, f] as const))("%s", (_name, fx) => {
    it("is well formed", () => {
      expect(fx.patterns.length).toBeGreaterThan(0);
      for (const p of fx.patterns) expect(PATTERNS).toContain(p);
      expect(fx.wearerSpeaker).toBeTruthy();
      const ids = new Set(fx.transcript.utterances.map((u) => u.id));
      expect(ids.size).toBe(fx.transcript.utterances.length);
      for (const e of fx.expected) {
        expect(fx.patterns).toContain(e.pattern);
        for (const id of e.wearerUtteranceIds) {
          expect(ids.has(id)).toBe(true);
          const u = fx.transcript.utterances.find((x) => x.id === id);
          expect(u?.speaker).toBe(fx.wearerSpeaker);
        }
      }
    });

    it("never returns another speaker's words", () => {
      const others = fx.transcript.utterances
        .filter((u) => u.speaker !== fx.wearerSpeaker)
        .map((u) => u.text.toLowerCase());
      const out = JSON.stringify(detectRepairs(fx.transcript, { wearerSpeaker: fx.wearerSpeaker })).toLowerCase();
      for (const text of others) expect(out).not.toContain(text);
    });

    const ready = fx.patterns.every((p) => IMPLEMENTED.has(p));
    it.skipIf(!ready)("matches expected moments", () => {
      const got = detectRepairs(fx.transcript, { wearerSpeaker: fx.wearerSpeaker }).map((m) => ({
        pattern: m.pattern,
        wearerUtteranceIds: m.wearerUtteranceIds,
      }));
      expect(got).toEqual(fx.expected);
    });
  });
});
