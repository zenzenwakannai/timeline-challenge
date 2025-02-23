import React, { useCallback, useState } from "react";

type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  "data-testid"?: string;
};

export const NumberInput = ({
  value,
  // onChange,
  min,
  max,
  step,
  "data-testid": dataTestId,
}: NumberInputProps) => {
  const [displayedValue, setDisplayedValue] = useState(String(value));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayedValue(e.target.value);
  }, []);

  return (
    <input
      className="rounded bg-gray-700 px-1"
      type="number"
      value={displayedValue}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      data-testid={dataTestId}
    />
  );
};
