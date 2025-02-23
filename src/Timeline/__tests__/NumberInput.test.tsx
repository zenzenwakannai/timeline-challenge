import { render, screen } from "@testing-library/react";
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
    expect(screen.getByTestId("test-input")).toHaveValue(defaultProps.value);
  });
});
