import { expect, Locator } from "@playwright/test";

export const getTranslateX = async (locator: Locator) => {
  return await locator.evaluate((el) => {
    const transform = getComputedStyle(el).transform;

    return new DOMMatrixReadOnly(transform).m41;
  });
};

export const getLocatorWidths = async (locator: Locator) => {
  return await locator.evaluateAll((elements) =>
    elements.map((element) => (element as HTMLElement).offsetWidth),
  );
};

export const expectAllLocatorWidthsSame = async (locator: Locator) => {
  const widths = await getLocatorWidths(locator);
  expect(new Set(widths).size).toBe(1);
};

export const expectAllLocatorWidthsSameAndEqual = async (
  locator: Locator,
  expectedWidth: number,
) => {
  const widths = await getLocatorWidths(locator);
  expect(new Set(widths).size).toBe(1);
  expect(widths[0]).toBe(expectedWidth);
};

export const expectAllLocatorWidthsSameAndNotEqual = async (
  locator: Locator,
  expectedWidth: number,
) => {
  const widths = await getLocatorWidths(locator);
  expect(new Set(widths).size).toBe(1);
  expect(widths[0]).not.toBe(expectedWidth);
};
