import { expect, test } from "@playwright/test";
const URL = "http://localhost:3000";

const KEYFRAME_LIST_TEST_ID = "keyframe-list";
const TRACK_LIST_TEST_ID = "track-list";

test.describe("TrackList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#4-1-1 Scrolling the Track List scrolls the Keyframe List", async ({
    page,
  }) => {
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const trackList = page.locator(`[data-testid="${TRACK_LIST_TEST_ID}"]`);

    await trackList.evaluate((el) => (el.scrollTop = 100));
    await expect(keyframeList).toHaveJSProperty("scrollTop", 100);
  });

  test("#4-1-2 Scrolling the Keyframe List scrolls the Track List", async ({
    page,
  }) => {
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const trackList = page.locator(`[data-testid="${TRACK_LIST_TEST_ID}"]`);

    await keyframeList.evaluate((el) => (el.scrollTop = 120));
    await expect(trackList).toHaveJSProperty("scrollTop", 120);
  });
});
