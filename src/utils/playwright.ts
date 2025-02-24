import { Locator } from "@playwright/test";

export const getTranslateX = async (locator: Locator) => {
  return await locator.evaluate((el) => {
    const transform = getComputedStyle(el).transform;
    const match = transform.match(
      // Get the `x` value from `matrix(a, b, c, d, x, y)`
      /matrix\([^,]+, [^,]+, [^,]+, [^,]+, ([^,]+), [^,]+\)/,
    );
    return match ? parseFloat(match[1]) : null;
  });
};
