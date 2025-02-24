import { expect, test } from "@playwright/test";

const URL = "http://localhost:3000";

const KEYFRAME_LIST_TEST_ID = "keyframe-list";
const TRACK_LIST_TEST_ID = "track-list";

test.describe("TrackList", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#4-1 Vertical scrolling the Track List scrolls the Keyframe List", async ({
    page,
  }) => {
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const trackList = page.locator(`[data-testid="${TRACK_LIST_TEST_ID}"]`);

    await trackList.evaluate((el) => (el.scrollTop = 100));
    await page.waitForTimeout(100);
    await expect(keyframeList).toHaveJSProperty("scrollTop", 100);
  });
});
