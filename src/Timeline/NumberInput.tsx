import React, { useCallback, useEffect, useState } from "react";

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
  onChange,
  min,
  max,
  step,
  "data-testid": dataTestId,
}: NumberInputProps) => {
  const [displayedValue, setDisplayedValue] = useState(String(value));

  useEffect(() => {
    setDisplayedValue(String(value));
  }, [value]);

  const confirmValue = useCallback(() => {
    onChange(Number(displayedValue));
  }, [displayedValue, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayedValue(e.target.value);
  }, []);

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleBlur = useCallback(() => {
    confirmValue();
  }, [confirmValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (key === "ArrowUp" || key === "ArrowDown") {
        const isIncrement = key === "ArrowUp";
        const stepSize = step ?? 1;
        const adjustedStep = isIncrement ? stepSize : -stepSize;
        const newValue = Number(displayedValue) + adjustedStep;

        onChange(Number(newValue));
      }
    },
    [displayedValue, onChange, step],
  );

  return (
    <input
      className="rounded bg-gray-700 px-1"
      type="number"
      value={displayedValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
      step={step}
      data-testid={dataTestId}
    />
  );
};
