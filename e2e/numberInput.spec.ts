import { expect, test } from "@playwright/test";

const URL = "http://localhost:3000";
const INPUT_TEST_ID = "current-time-input";
const INPUT_INITIAL_VALUE = 0;
const INPUT_STEP = 10;

// We can't directly click the step buttons because they are part of the browser's
// shadow DOM. They are not accessible via standard DOM selectors. Instead, we use
// the `stepUp()` and `stepDown()` methods to simulate the same behavior.
test("#1-3 Clicking native step buttons changes value immediately", async ({
  page,
}) => {
  await page.goto(URL);

  const input = page.locator(`[data-testid="${INPUT_TEST_ID}"]`);
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await input.focus();

  await input.evaluate((el) => {
    (el as HTMLInputElement).stepUp();
  });
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE + INPUT_STEP));

  await input.evaluate((el) => {
    (el as HTMLInputElement).stepDown();
  });
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));
});

test("#1-4 Pressing up/down arrow keys changes the value immediately", async ({
  page,
}) => {
  await page.goto(URL);

  const input = page.locator(`[data-testid="${INPUT_TEST_ID}"]`);
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await input.focus();

  await page.keyboard.press("ArrowUp");
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE + INPUT_STEP));

  await page.keyboard.press("ArrowDown");
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("ArrowUp");
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE + INPUT_STEP * 3));
});

test("#1-5 Entire text is selected when the input field gains focus", async ({
  page,
}) => {
  await page.goto(URL);

  const input = page.locator(`[data-testid="${INPUT_TEST_ID}"]`);
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await input.focus();

  await page.keyboard.type("200");
  await input.blur();

  await input.focus();
  await page.keyboard.type("300");
  await input.blur();
  await expect(input).toHaveValue("300");
});

test("#1-6 Entire text is selected after using the native step buttons", async ({
  page,
}) => {
  await page.goto(URL);

  const input = page.locator(`[data-testid="${INPUT_TEST_ID}"]`);
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await input.focus();

  // Simulate the behavior of the native step buttons
  await page.keyboard.press("ArrowUp");
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE + INPUT_STEP));

  await page.keyboard.type("300");
  await expect(input).toHaveValue("300");
});

test("#1-7 Entire text is selected after using the up arrow or down arrow keys", async ({
  page,
}) => {
  await page.goto(URL);

  const input = page.locator(`[data-testid="${INPUT_TEST_ID}"]`);
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE));

  await input.focus();

  await page.keyboard.press("ArrowUp");
  await expect(input).toHaveValue(String(INPUT_INITIAL_VALUE + INPUT_STEP));

  await page.keyboard.type("300");
  await expect(input).toHaveValue("300");

  await input.blur();
  await input.focus();

  await page.keyboard.press("ArrowDown");
  await expect(input).toHaveValue(String(300 - INPUT_STEP));

  await page.keyboard.type("600");
  await expect(input).toHaveValue("600");
});
