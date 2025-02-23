import React, { useCallback, useEffect, useRef, useState } from "react";
import { removeLeadingZeros } from "../utils/strings";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const isEscaping = useRef(false);

  useEffect(() => {
    setDisplayedValue(String(value));
  }, [value]);

  const onCommit = useCallback(
    (valueToCommit: string) => {
      const valueWithoutLeadingZeros = removeLeadingZeros(valueToCommit);
      const numericValue = Number(valueWithoutLeadingZeros);

      let adjustedValue;
      if (min !== undefined && numericValue < min) {
        adjustedValue = min;
      } else if (max !== undefined && numericValue > max) {
        adjustedValue = max;
      } else {
        adjustedValue = numericValue;
      }

      if (value !== adjustedValue) {
        onChange(adjustedValue);
      } else {
        setDisplayedValue(String(adjustedValue));
      }
    },
    [min, max, value, onChange],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayedValue(newValue);

      // Detect if the input is caused by native step buttons
      // Note: nativeEvent won't have inputType property when using native step buttons.
      if (!("inputType" in e.nativeEvent)) {
        onCommit(newValue);
        inputRef.current?.select();
      }
    },
    [onCommit],
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleBlur = useCallback(() => {
    if (!isEscaping.current) {
      onCommit(displayedValue);
    }
    isEscaping.current = false;
  }, [displayedValue, onCommit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (key === "Enter") {
        e.preventDefault();

        onCommit(displayedValue);
        inputRef.current?.blur();
      } else if (key === "Escape") {
        e.preventDefault();

        isEscaping.current = true; // Prevent calling onChange in handleBlur
        setDisplayedValue(String(value));
        inputRef.current?.blur();
      } else if (key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();

        const stepValue = step ?? 1;
        const newValue = String(
          Number(displayedValue) + (key === "ArrowUp" ? stepValue : -stepValue),
        );

        setDisplayedValue(newValue);
        onCommit(newValue);
      }
    },
    [displayedValue, onCommit, step, value],
  );

  return (
    <input
      ref={inputRef}
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
