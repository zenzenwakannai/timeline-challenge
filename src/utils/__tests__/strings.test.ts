import { processInputValue } from "../strings";

describe("processInputValue", () => {
  it("should remove leading zeros", () => {
    expect(processInputValue("0123")).toBe("123");
    expect(processInputValue("00456")).toBe("456");
    expect(processInputValue("000789")).toBe("789");
  });

  it("should preserve single zero", () => {
    expect(processInputValue("0")).toBe("0");
  });

  it("should handle multiple zeros", () => {
    expect(processInputValue("00")).toBe("0");
    expect(processInputValue("000")).toBe("0");
  });

  it("should handle negative values", () => {
    expect(processInputValue("-0123")).toBe("-123");
    expect(processInputValue("-00456")).toBe("-456");
    expect(processInputValue("-000789")).toBe("-789");
  });

  it("should handle non-numeric characters", () => {
    expect(processInputValue("123a")).toBe("123");
    expect(processInputValue("456b")).toBe("456");
    expect(processInputValue("789c")).toBe("789");
  });
});
