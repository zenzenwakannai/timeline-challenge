import { expect, test } from "@playwright/test";
import { getTranslateX } from "../src/utils/playwright";

const URL = "http://localhost:3000";

const CURRENT_TIME_INPUT_TEST_ID = "current-time-input";
const DURATION_INPUT_TEST_ID = "duration-input";
const KEYFRAME_LIST_TEST_ID = "keyframe-list";
const PLAYHEAD_TEST_ID = "playhead";
const RULER_BAR_TEST_ID = "ruler-bar";
const RULER_TEST_ID = "ruler";

test.describe("Ruler", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#3-1 Clicking or dragging on the Ruler updates the Current Time and Playhead position", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const playhead = page.locator(`[data-testid="${PLAYHEAD_TEST_ID}"]`);
    const rulerBar = page.locator(`[data-testid="${RULER_BAR_TEST_ID}"]`);

    await expect(currentTimeInput).toHaveValue("0");

    await rulerBar.click({ position: { x: 200, y: 5 } });
    await expect(currentTimeInput).toHaveValue("200");

    await page.dragAndDrop(
      `[data-testid="${RULER_BAR_TEST_ID}"]`,
      `[data-testid="${RULER_BAR_TEST_ID}"]`,
      {
        sourcePosition: { x: 10, y: 5 },
        targetPosition: { x: 400, y: 5 },
      },
    );
    await expect(currentTimeInput).toHaveValue("400");

    const newTranslateX = await getTranslateX(playhead);
    expect(newTranslateX).toBe(399); // 1px for 50% width (2px) of the playhead
  });

  test("#3-2 Horizontal scrolling the Ruler scrolls the Keyframe List", async ({
    page,
  }) => {
    const keyframeList = page.locator(
      `[data-testid="${KEYFRAME_LIST_TEST_ID}"]`,
    );
    const ruler = page.locator(`[data-testid="${RULER_TEST_ID}"]`);

    await ruler.evaluate((el) => (el.scrollLeft = 200));
    await expect(keyframeList).toHaveJSProperty("scrollLeft", 200);
  });

  test("#3-3 Ruler length visually represents the total Duration (1ms = 1px)", async ({
    page,
  }) => {
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );
    const rulerBar = page.locator(`[data-testid="${RULER_BAR_TEST_ID}"]`);

    const initialDuration = await durationInput.inputValue();
    const initialWidth = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(parseInt(initialDuration)).toBe(initialWidth);

    await durationInput.fill("3000");
    await durationInput.press("Enter");

    const newWidth = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(newWidth).toBe(3000);
  });

  test("#3-4 Ruler length updates only after specific actions on Duration input", async ({
    page,
  }) => {
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );
    const rulerBar = page.locator(`[data-testid="${RULER_BAR_TEST_ID}"]`);

    await durationInput.fill("3500");
    const widthBeforeEnter = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(widthBeforeEnter).not.toBe(3500);

    await durationInput.press("Enter");
    const widthAfterEnter = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(widthAfterEnter).toBe(3500);

    await durationInput.focus();
    await durationInput.fill("4000");
    await durationInput.blur();
    const widthAfterLoseFocus = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(widthAfterLoseFocus).toBe(4000);

    await durationInput.focus();
    await page.keyboard.press("ArrowUp");
    const widthAfterArrowUp = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(widthAfterArrowUp).toBe(4010);

    await durationInput.focus();
    await page.keyboard.press("ArrowDown");
    const widthAfterArrowDown = await rulerBar.evaluate(
      (el) => (el as HTMLElement).offsetWidth,
    );
    expect(widthAfterArrowDown).toBe(4000);
  });
});
