import React, { useCallback, useEffect, useRef, useState } from "react";

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

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setDisplayedValue(newValue);

      // Detect if the input is caused by native step buttons
      // Note: nativeEvent won't have inputType property when using native step buttons.
      if (!("inputType" in e.nativeEvent)) {
        onChange(Number(newValue));
        inputRef.current?.select();
      }
    },
    [onChange],
  );

  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  }, []);

  const handleBlur = useCallback(() => {
    if (!isEscaping.current) {
      onChange(Number(displayedValue));
    }
    isEscaping.current = false;
  }, [displayedValue, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = e;

      if (key === "Enter") {
        onChange(Number(displayedValue));
        inputRef.current?.blur();
      } else if (key === "Escape") {
        isEscaping.current = true; // Prevent calling onChange in handleBlur
        setDisplayedValue(String(value));
        inputRef.current?.blur();
      } else if (key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();

        const stepValue = step ?? 1;
        const newValue =
          Number(displayedValue) + (key === "ArrowUp" ? stepValue : -stepValue);

        setDisplayedValue(String(newValue));
        onChange(newValue);
      }
    },
    [displayedValue, onChange, step, value],
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
