import { processInputValue } from "../strings";

describe("processInputValue", () => {
  test("#1-10-1 should remove leading zeros", () => {
    expect(processInputValue("0123")).toBe("123");
    expect(processInputValue("00456")).toBe("456");
    expect(processInputValue("000789")).toBe("789");
  });

  test("#1-10-2 should preserve single zero", () => {
    expect(processInputValue("0")).toBe("0");
  });

  test("#1-10-3 should handle multiple zeros", () => {
    expect(processInputValue("00")).toBe("0");
    expect(processInputValue("000")).toBe("0");
  });

  test("#1-10-4 should handle negative values", () => {
    expect(processInputValue("-0123")).toBe("-123");
    expect(processInputValue("-00456")).toBe("-456");
    expect(processInputValue("-000789")).toBe("-789");
  });

  test("#1-13 should handle non-numeric characters", () => {
    expect(processInputValue("123a")).toBe("123");
    expect(processInputValue("456b")).toBe("456");
    expect(processInputValue("789c")).toBe("789");
  });
});
