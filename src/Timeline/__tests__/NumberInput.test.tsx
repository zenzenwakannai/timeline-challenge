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

    expect(input).toHaveValue(2000);
  });

  it("updates displayed value while typing without triggering onChange", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");

    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it("immediately changes value and removes focus when clicking outside the input field", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");
    // Simulate clicking outside the input field
    await userEvent.click(document.body);

    expect(input).not.toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(1500);
  });

  it("immediately changes value when clicking the native step buttons", () => {
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

  it("immediately changes value when pressing the up arrow key", async () => {
    render(<NumberInput {...defaultProps} value={1990} />);
    const input = screen.getByTestId<HTMLInputElement>("test-input");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowUp}");

    expect(input).toHaveValue(2000);
    expect(defaultProps.onChange).toHaveBeenCalledWith(2000);
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

  describe("leading zero handling", () => {
    it("should preserve leading zeros while typing", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "0123");

      expect(onChange).not.toHaveBeenCalled();
    });

    it("should remove leading zeros when losing focus", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "0123");
      await userEvent.click(document.body);

      expect(onChange).toHaveBeenCalledWith(123);
    });

    it("should remove leading zeros when using the arrow keys", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "0123");
      await userEvent.keyboard("{ArrowUp}");

      expect(onChange).toHaveBeenCalledWith(123 + (defaultProps.step ?? 1));
    });

    it("should remove leading zeros when pressing Enter", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "0123");
      await userEvent.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(123);
    });
  });

  describe("negative value handling", () => {
    it("should adjust negative values to minimum when min is specified", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "-123");
      await userEvent.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(defaultProps.min);
    });

    it("should allow negative values when min is not specified", async () => {
      const onChange = jest.fn();
      const propsWithoutMin = { ...defaultProps, min: undefined };
      render(<NumberInput {...propsWithoutMin} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "-123");
      await userEvent.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(-123);
    });

    it("should adjust negative values to minimum when using arrow keys", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} value={1} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.click(input);
      await userEvent.keyboard("{ArrowDown}");

      expect(onChange).toHaveBeenCalledWith(defaultProps.min);
    });
  });

  describe("decimal value handling", () => {
    it("should round decimal values to nearest integer when committing", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "105.5");
      await userEvent.keyboard("{Enter}");

      expect(onChange).toHaveBeenCalledWith(106);
    });
  });

  describe("invalid input handling", () => {
    it("should ignore non-numeric input while typing", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "1500abc");

      expect(input).toHaveDisplayValue("1500");
      expect(input).toHaveValue(1500);
      expect(onChange).not.toHaveBeenCalled();
    });

    it("should allow numeric input with decimal point and minus sign", async () => {
      const onChange = jest.fn();
      render(<NumberInput {...defaultProps} onChange={onChange} />);
      const input = screen.getByTestId<HTMLInputElement>("test-input");

      await userEvent.clear(input);
      await userEvent.type(input, "-123.45abc");

      expect(input).toHaveDisplayValue("-123.45");
      expect(input).toHaveValue(-123.45);
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
