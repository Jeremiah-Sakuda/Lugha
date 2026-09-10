import { describe, expect, it } from "vitest";
import { looksTruncated, normalize, tokens } from "./normalize.js";

describe("normalize", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalize("I went to the Doctor, yesterday!")).toBe("i went to the doctor yesterday");
  });
  it("keeps apostrophes inside words", () => {
    expect(tokens("I don't know, it's fine")).toEqual(["i", "don't", "know", "it's", "fine"]);
  });
  it("drops filler sounds but not real words", () => {
    expect(tokens("um, I uh went, like, yesterday")).toEqual(["i", "went", "like", "yesterday"]);
  });
  it("collapses whitespace and curly quotes", () => {
    expect(normalize("  I’m   here  ")).toBe("i'm here");
  });
  it("returns no tokens for empty or punctuation-only text", () => {
    expect(tokens("...")).toEqual([]);
    expect(tokens("")).toEqual([]);
  });
});

describe("looksTruncated", () => {
  it("is false for a finished sentence", () => {
    expect(looksTruncated("I went to the doctor.")).toBe(false);
    expect(looksTruncated("Did you see it?")).toBe(false);
    expect(looksTruncated('He said "no."')).toBe(false);
  });
  it("is true for a trailing off or unterminated sentence", () => {
    expect(looksTruncated("I went to the")).toBe(true);
    expect(looksTruncated("I went to the...")).toBe(true);
    expect(looksTruncated("I went to the —")).toBe(true);
  });
  it("is false for empty text", () => {
    expect(looksTruncated("   ")).toBe(false);
  });
});
