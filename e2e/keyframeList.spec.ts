import { expect, test } from "@playwright/test";
import {
  expectAllLocatorWidthsSameAndEqual,
  expectAllLocatorWidthsSameAndNotEqual,
} from "../src/utils/playwright";
const URL = "http://localhost:3000";

const DURATION_INPUT_TEST_ID = "duration-input";
const KEYFRAME_LIST_TEST_ID = "keyframe-list";
const RULER_TEST_ID = "ruler";
const SEGMENT_TEST_ID = "segment";
const TRACK_LIST_TEST_ID = "track-list";

test.describe("KeyframeList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#5-1 Vertical scrolling the Keyframe List scrolls the Track List", async ({
    page,
  }) => {
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const trackList = page.locator(`[data-testid="${TRACK_LIST_TEST_ID}"]`);

    await keyframeList.evaluate((el) => (el.scrollTop = 120));
    await page.waitForTimeout(100);
    await expect(trackList).toHaveJSProperty("scrollTop", 120);
  });

  test("#5-2 Horizontal scrolling the Keyframe List scrolls the Ruler", async ({
    page,
  }) => {
    const ruler = page.locator(`[data-testid="${RULER_TEST_ID}"]`);
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );

    await keyframeList.evaluate((el) => (el.scrollLeft = 150));
    await page.waitForTimeout(100);
    await expect(ruler).toHaveJSProperty("scrollLeft", 150);
  });

  test("#5-3 Segment length visually represents the total Duration (1ms = 1px)", async ({
    page,
  }) => {
    const segment = page.locator(`[data-testid="${SEGMENT_TEST_ID}"]`);
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    const initialDuration = await durationInput.inputValue();
    await expectAllLocatorWidthsSameAndEqual(
      segment,
      parseInt(initialDuration),
    );

    await durationInput.fill("3000");
    await durationInput.press("Enter");

    await expectAllLocatorWidthsSameAndEqual(segment, 3000);
  });

  test("#5-4 Segment length updates only after specific actions on Duration input", async ({
    page,
  }) => {
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );
    const segment = page.locator(`[data-testid="${SEGMENT_TEST_ID}"]`);

    await durationInput.fill("3500");
    await expectAllLocatorWidthsSameAndNotEqual(segment, 3500);

    await durationInput.press("Enter");
    await expectAllLocatorWidthsSameAndEqual(segment, 3500);

    await durationInput.focus();
    await durationInput.fill("4000");
    await durationInput.blur();
    await expectAllLocatorWidthsSameAndEqual(segment, 4000);

    await durationInput.focus();
    await page.keyboard.press("ArrowUp");
    await expectAllLocatorWidthsSameAndEqual(segment, 4010);

    await durationInput.focus();
    await page.keyboard.press("ArrowDown");
    await expectAllLocatorWidthsSameAndEqual(segment, 4000);
  });
});
