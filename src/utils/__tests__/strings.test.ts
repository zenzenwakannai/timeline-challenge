import { removeLeadingZeros } from "../strings";

describe("removeLeadingZeros", () => {
  it("should remove leading zeros", () => {
    expect(removeLeadingZeros("0123")).toBe("123");
    expect(removeLeadingZeros("00456")).toBe("456");
    expect(removeLeadingZeros("000789")).toBe("789");
  });

  it("should preserve single zero", () => {
    expect(removeLeadingZeros("0")).toBe("0");
  });

  it("should handle multiple zeros", () => {
    expect(removeLeadingZeros("00")).toBe("0");
    expect(removeLeadingZeros("000")).toBe("0");
  });
});
