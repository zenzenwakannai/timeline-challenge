import { expect, test } from "@playwright/test";
import { getTranslateX } from "../src/utils/playwright";

const URL = "http://localhost:3000";

const CURRENT_TIME_INPUT_TEST_ID = "current-time-input";
const DURATION_INPUT_TEST_ID = "duration-input";
const PLAYHEAD_TEST_ID = "playhead";

test.describe("PlayControls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("#2-1 Current Time is always between 0ms and the Duration", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    await currentTimeInput.fill("-1000");
    await currentTimeInput.press("Enter");
    await expect(currentTimeInput).toHaveValue("0");

    await durationInput.fill("2000");
    await durationInput.press("Enter");

    await currentTimeInput.fill("5000");
    await currentTimeInput.press("Enter");
    await expect(currentTimeInput).toHaveValue("2000");
  });

  test("#2-2 Current Time adjusts if it exceeds the newly set Duration", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    await currentTimeInput.fill("3000");
    await currentTimeInput.press("Enter");

    await durationInput.fill("2000");
    await durationInput.press("Enter");

    await expect(currentTimeInput).toHaveValue("2000");
  });

  test("#2-3 Duration is always between 100ms and 6000ms", async ({ page }) => {
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    await durationInput.fill("50");
    await durationInput.press("Enter");
    await expect(durationInput).toHaveValue("100");

    await durationInput.fill("7000");
    await durationInput.press("Enter");
    await expect(durationInput).toHaveValue("6000");
  });

  test("#2-4 Current Time and Duration are always multiples of 10ms", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    await currentTimeInput.fill("123");
    await currentTimeInput.press("Enter");
    await expect(currentTimeInput).toHaveValue("120");

    await currentTimeInput.fill("127");
    await currentTimeInput.press("Enter");
    await expect(currentTimeInput).toHaveValue("130");

    await durationInput.fill("375");
    await durationInput.press("Enter");
    await expect(durationInput).toHaveValue("380");

    await durationInput.fill("382");
    await durationInput.press("Enter");
    await expect(durationInput).toHaveValue("380");
  });

  test("#2-5 Current Time and Duration are always positive integers", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const durationInput = page.locator(
      `[data-testid="${DURATION_INPUT_TEST_ID}"]`,
    );

    await currentTimeInput.fill("-50");
    await currentTimeInput.press("Enter");
    await expect(currentTimeInput).toHaveValue("0"); // MIN_TIME

    await durationInput.fill("-500");
    await durationInput.press("Enter");
    await expect(durationInput).toHaveValue("100"); // MIN_DURATION
  });

  test("#2-6 Playhead position updates only after specific actions", async ({
    page,
  }) => {
    const currentTimeInput = page.locator(
      `[data-testid="${CURRENT_TIME_INPUT_TEST_ID}"]`,
    );
    const playhead = page.locator(`[data-testid="${PLAYHEAD_TEST_ID}"]`);

    const oldTranslateX = await getTranslateX(playhead);

    await currentTimeInput.fill("100");
    const newTranslateXBeforeEnter = await getTranslateX(playhead);
    expect(newTranslateXBeforeEnter).toBe(oldTranslateX);

    await currentTimeInput.press("Enter");
    const newTranslateXAfterEnter = await getTranslateX(playhead);
    expect(newTranslateXAfterEnter).not.toBe(oldTranslateX);
  });
});
