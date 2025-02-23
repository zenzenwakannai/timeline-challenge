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
    const input = screen.getByTestId("test-input");

    expect(input).toHaveValue(2000);
  });

  it("updates displayed value while typing without triggering onChange", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");

    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("immediately changes value and removes focus when clicking outside the input field", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    // Simulate clicking outside the input field
    await userEvent.click(document.body);

    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("immediately changes value when clicking the native step buttons", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    // Simulate clicking the native step buttons
    fireEvent.change(input, {
      target: { value: "1990" },
      nativeEvent: {},
    });

    expect(input).toHaveValue(1990);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("immediately changes value when pressing the up arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveValue(2010);
    expect(defaultProps.onChange).toHaveBeenCalledWith(2010);
  });

  it("immediately changes value when pressing the down arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveValue(1990);
    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("selects entire text when the input gains focus", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);

    expect(input).toHaveFocus();
  });

  it("selects entire text after using the native step buttons", () => {
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

  it("selects entire text after using the up arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveFocus();
  });

  it("selects entire text after using the down arrow key", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");

    expect(input).toHaveFocus();
  });

  it("confirms value and removes focus when pressing Enter", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    await userEvent.keyboard("{Enter}");

    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("reverts to original value and removes focus when pressing Escape", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    await userEvent.keyboard("{Escape}");

    expect(input).toHaveValue(2000);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
