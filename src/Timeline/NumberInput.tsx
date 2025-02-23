import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { roundToTen } from "../utils/numbers";
import { processInputValue } from "../utils/strings";

export type NumberInputProps = {
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
  const shouldSelectAfterUpdate = useRef(false);
  const isEscaping = useRef(false);

  useEffect(() => {
    setDisplayedValue(String(value));
  }, [value]);

  useLayoutEffect(() => {
    if (shouldSelectAfterUpdate.current) {
      inputRef.current?.select();
      shouldSelectAfterUpdate.current = false;
    }
  }, [displayedValue]);

  const onCommit = useCallback(
    (valueToCommit: string) => {
      const processedValue = processInputValue(valueToCommit);
      const numericValue = Math.round(Number(processedValue));

      let adjustedValue = roundToTen(numericValue);
      if (min !== undefined && adjustedValue < min) {
        adjustedValue = min;
      } else if (max !== undefined && adjustedValue > max) {
        adjustedValue = max;
      }

      if (value !== adjustedValue) {
        onChange(adjustedValue);
      } else {
        setDisplayedValue(String(adjustedValue));
      }
    },
    [max, min, onChange, value],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = processInputValue(e.target.value);
      setDisplayedValue(newValue);

      // Detect if the input is caused by native step buttons or arrow keys
      // Note: nativeEvent won't have inputType property when using native step buttons or arrow keys
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
        // In a real browser, <input type="number"> would automatically update its value
        // when using the native step buttons or arrow keys. However, in jsdom, this native
        // behavior is not simulated. Therefore, we manually update the state and call
        // onCommit.
        e.preventDefault();

        const stepValue = step ?? 1;
        const newValue = String(
          Number(displayedValue) + (key === "ArrowUp" ? stepValue : -stepValue),
        );

        setDisplayedValue(newValue);
        onCommit(newValue);
        shouldSelectAfterUpdate.current = true;
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
