import { describe, expect, it } from "vitest";
import { detectRepairs } from "./index.js";

describe("detectRepairs", () => {
  it("requires a wearer speaker label", () => {
    expect(() =>
      detectRepairs({ conversationId: "c1", utterances: [] }, { wearerSpeaker: "" }),
    ).toThrow(/wearerSpeaker/);
  });

  it("returns no moments for an empty transcript", () => {
    expect(
      detectRepairs({ conversationId: "c1", utterances: [] }, { wearerSpeaker: "speaker_1" }),
    ).toEqual([]);
  });
});
