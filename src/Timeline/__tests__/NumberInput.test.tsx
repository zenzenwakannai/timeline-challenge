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

  it("confirms value on blur and calls onChange if value changed", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    input.blur();

    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("confirms value on spinner click", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    fireEvent.change(input, { target: { value: "1990" } });
    fireEvent.blur(input);

    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("confirms value on ArrowDown key", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });

    expect(defaultProps.onChange).toHaveBeenCalledWith(1990);
  });

  it("selects entire text when the input gains focus", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const selectSpy = jest.spyOn(input, "select");

    fireEvent.focus(input);

    expect(selectSpy).toHaveBeenCalled();
  });

  it("selects entire text after using the native step buttons", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const selectSpy = jest.spyOn(input, "select");

    // Simulate using native step buttons
    fireEvent.change(input, {
      target: { value: "1990" },
      nativeEvent: {}, // When using step buttons, nativeEvent won't have inputType property
    });

    expect(selectSpy).toHaveBeenCalled();
  });

  it("selects entire text after using the up arrow or down arrow keys", () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");
    const selectSpy = jest.spyOn(input, "select");

    // Simulate arrow key press and the subsequent change event
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.change(input, {
      target: { value: "1990" },
      nativeEvent: {}, // When using arrow keys, nativeEvent won't have inputType property
    });

    expect(selectSpy).toHaveBeenCalled();
  });
});
