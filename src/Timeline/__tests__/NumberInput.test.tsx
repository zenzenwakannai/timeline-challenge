import { render, screen } from "@testing-library/react";
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays the initial value", () => {
    render(<NumberInput {...defaultProps} />);
    expect(screen.getByTestId("test-input")).toHaveValue(2000);
  });

  it("updates displayed value while typing without triggering onChange", async () => {
    render(<NumberInput {...defaultProps} />);
    const input = screen.getByTestId("test-input");

    await userEvent.clear(input);
    await userEvent.type(input, "1500");

    expect(input).toHaveValue(1500);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });
});
