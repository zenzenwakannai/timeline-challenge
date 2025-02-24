import { expect, test } from "@playwright/test";
import { getTranslateX } from "../src/utils/playwright";

const URL = "http://localhost:3000";

const CURRENT_TIME_INPUT_TEST_ID = "current-time-input";
const KEYFRAME_LIST_TEST_ID = "keyframe-list";
const PLAYHEAD_TEST_ID = "playhead";
const RULER_TEST_ID = "ruler";

test.describe("Playhead", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#6-1 Playhead moves in sync with the Ruler and Keyframe List during horizontal scrolling", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const playhead = page.locator(`[data-testid="${PLAYHEAD_TEST_ID}"]`);
    const ruler = page.locator(`[data-testid="${RULER_TEST_ID}"]`);

    // Ensure the playhead is not hidden due to scrollLeft, otherwise getTranslateX
    // will return null
    await currentTimeInput.fill("500");
    await currentTimeInput.press("Enter");

    await ruler.evaluate((el) => (el.scrollLeft = 0));
    expect(ruler).toHaveJSProperty("scrollLeft", 0);
    await page.waitForTimeout(100);

    const initialPlayheadTranslateX = await getTranslateX(playhead);
    if (initialPlayheadTranslateX === null) {
      throw new Error("initialPlayheadTranslateX is null");
    }

    await ruler.evaluate((el) => (el.scrollLeft = 100));
    expect(ruler).toHaveJSProperty("scrollLeft", 100);
    await page.waitForTimeout(100);

    const updatedPlayheadTranslateX1 = await getTranslateX(playhead);
    expect(updatedPlayheadTranslateX1).not.toBe(initialPlayheadTranslateX);

    await keyframeList.evaluate((el) => (el.scrollLeft = 200));
    expect(keyframeList).toHaveJSProperty("scrollLeft", 200);
    await page.waitForTimeout(100);

    const updatedPlayheadTranslateX2 = await getTranslateX(playhead);
    expect(updatedPlayheadTranslateX2).not.toBe(initialPlayheadTranslateX);
  });

  test("#6-2 Playhead maintains its relative position during horizontal scrolling", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const playhead = page.locator(`[data-testid="${PLAYHEAD_TEST_ID}"]`);
    const ruler = page.locator(`[data-testid="${RULER_TEST_ID}"]`);

    // Ensure the playhead is not hidden due to scrollLeft, otherwise getTranslateX
    // will return null
    await currentTimeInput.fill("500");
    await currentTimeInput.press("Enter");

    await ruler.evaluate((el) => (el.scrollLeft = 0));
    expect(ruler).toHaveJSProperty("scrollLeft", 0);
    await page.waitForTimeout(100);

    const initialPlayheadTranslateX = await getTranslateX(playhead);

    if (initialPlayheadTranslateX === null) {
      throw new Error("initialPlayheadTranslateX is null");
    }

    await ruler.evaluate((el) => (el.scrollLeft = 100));
    expect(ruler).toHaveJSProperty("scrollLeft", 100);
    await page.waitForTimeout(100);

    const updatedPlayheadTranslateX1 = await getTranslateX(playhead);
    expect(updatedPlayheadTranslateX1).toBe(initialPlayheadTranslateX - 100);

    await keyframeList.evaluate((el) => (el.scrollLeft = 200));
    expect(keyframeList).toHaveJSProperty("scrollLeft", 200);
    await page.waitForTimeout(100);

    const updatedPlayheadTranslateX2 = await getTranslateX(playhead);
    expect(updatedPlayheadTranslateX2).toBe(initialPlayheadTranslateX - 200);
  });

  test("#6-3 Playhead is visible only when within the Timeline's visible area, using the `hidden` attribute when completely out of view", async ({
    page,
  }) => {
    const playhead = page.locator(`[data-testid="${PLAYHEAD_TEST_ID}"]`);
    const ruler = page.locator(`[data-testid="${RULER_TEST_ID}"]`);

    await ruler.evaluate((el) => (el.scrollLeft = 0));
    await expect(playhead).not.toBeHidden();

    await ruler.evaluate((el) => (el.scrollLeft = 2000));
    await expect(playhead).toBeHidden();
  });
});
