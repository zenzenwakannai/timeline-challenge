import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberInput } from "../NumberInput";

describe("NumberInput", () => {
  const defaultProps = {
    value: 2000,
    onChange: jest.fn(),
    min: 0,
    max: 2000,
    step: 10,
    "data-testid": "test-input",
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("displays the initial value", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    expect(input).toHaveValue(defaultProps.value);
  });

  it("1-1. updates displayed value while typing without triggering onChange", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");

    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("1-2. changes value and removes focus when clicking outside the input field", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    await userEvent.click(document.body); // Simulate clicking outside the input field

    expect(input).not.toHaveFocus();
    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("1-3. changes value when clicking the native step buttons", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    // Simulate clicking the native step buttons
    fireEvent.change(input, {
      target: { value: "1990" },
      nativeEvent: {},
    });

    expect(input).toHaveValue(1990);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("1-4-1. changes value when pressing the up arrow key", async () => {
    render(<NumberInput {...defaultProps} value={1990} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveValue(2000);
    expect(defaultProps.onChange).toHaveBeenCalledWith(2000);
  });

  it("1-4-2. changes value when pressing the down arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveValue(1990);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("1-5. selects entire text when the input gains focus", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);

    expect(input).toHaveFocus();
  });

  it("1-6. selects entire text after using the native step buttons", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const selectSpy = jest.spyOn(input, "select");

    // Simulate clicking the native step buttons
    fireEvent.change(input, {
      target: { value: "1990" },
      nativeEvent: {},
    });

    expect(selectSpy).toHaveBeenCalled();
  });

  it("1-7-1. selects entire text after using the up arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveFocus();
  });

  it("1-7-2. selects entire text after using the down arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveFocus();
  });

  it("1-8. confirms value and removes focus when pressing Enter", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    await userEvent.keyboard("{Enter}");

    expect(input).toHaveValue(1500);
    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("1-9. reverts to original value and removes focus when pressing Escape", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    await userEvent.keyboard("{Escape}");

    expect(input).toHaveValue(2000);
    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("1-10. preserve at most one leading zero but not more than one while typing", async () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "0");

    expect(input).toHaveDisplayValue("0");
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.clear(input);
    await userEvent.type(input, "000");

    expect(input).toHaveDisplayValue("0");
    expect(onChange).not.toHaveBeenCalled();

    await userEvent.clear(input);
    await userEvent.type(input, "000123");

    expect(input).toHaveDisplayValue("123");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("1-12. round decimal values to nearest integer when committing", async () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "105.5");
    await userEvent.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledWith(110);
  });

  it("1-13. ignore non-numeric input while typing", async () => {
    const onChange = jest.fn();
    render(<NumberInput {...defaultProps} onChange={onChange} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500abc");

    expect(input).toHaveDisplayValue("1500");
    expect(input).toHaveValue(1500);
    expect(onChange).not.toHaveBeenCalled();
  });
});
