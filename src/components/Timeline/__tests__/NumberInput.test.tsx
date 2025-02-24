import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "../NumberInput";

describe("NumberInput", () => {
  const defaultProps = {
    value: 1000,
    onChange: jest.fn(),
    min: 0,
    max: 2000,
    step: 10,
    "data-testid": "test-input",
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("#1-0 displays the initial value", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    expect(input).toHaveValue(defaultProps.value);
  });

  test("#1-1 updates the displayed value immediately while typing but does not trigger onChange until confirmed", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "1500");
    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.keyboard("{Enter}");
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  test("#1-2 changes value and removes focus when clicking outside the input field", async () => {
    render(
      <>
        <NumberInput {...defaultProps} />
        <div data-testid="outside-element" />
      </>,
    );
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const outsideElement = screen.getByTestId("outside-element");
    const user = userEvent.setup();

    await user.click(input);
    expect(input).toHaveFocus();

    await user.clear(input);
    await user.type(input, "1500");
    expect(input).toHaveValue(1500);

    await user.click(outsideElement);
    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  test("#1-8 confirms value and removes focus when pressing Enter", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "1500");
    expect(input).toHaveValue(1500);

    await user.keyboard("{Enter}");
    expect(input).toHaveValue(1500);
    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  test("#1-9 reverts to original value and removes focus when pressing Escape", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "1500");
    expect(input).toHaveValue(1500);

    await user.keyboard("{Escape}");
    expect(input).toHaveValue(defaultProps.value);
    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  test("#1-10 preserve at most one leading zero but not more than one while typing", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "0");
    expect(input).toHaveDisplayValue("0");
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "000");
    expect(input).toHaveDisplayValue("0");
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "000123");
    expect(input).toHaveDisplayValue("123");
    expect(defaultProps.onChange).not.toHaveBeenCalled();

    await user.clear(input);
    await user.type(input, "-000456");
    expect(input).toHaveDisplayValue("-456");
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  test("#1-11 adjusts negative values to the minimum allowed value when committing", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "-200");
    expect(input).toHaveDisplayValue("-200");

    await user.keyboard("{Enter}");
    expect(defaultProps.onChange).toHaveBeenCalledWith(defaultProps.min);
  });

  test("#1-12 round decimal values to nearest integer when committing", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "105.5");
    await user.keyboard("{Enter}");

    expect(defaultProps.onChange).toHaveBeenCalledWith(106);
  });

  test("#1-13 ignore non-numeric input while typing", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, "ab1500cd");

    expect(input).toHaveDisplayValue("1500");
    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
