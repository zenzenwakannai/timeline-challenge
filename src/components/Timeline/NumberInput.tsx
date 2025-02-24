import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { roundToNearestInteger } from "../../utils/numbers";
import { processInputValue } from "../../utils/strings";

const formatValueToDisplayedValue = (value: number) => {
  return String(value);
};

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  roundToNearestIntegerMethod?: (value: number) => number;
  min?: number;
  max?: number;
  step?: number;
  "data-testid"?: string;
};

export const NumberInput = ({
  value,
  onChange,
  roundToNearestIntegerMethod = roundToNearestInteger,
  min,
  max,
  step,
  "data-testid": dataTestId,
}: NumberInputProps) => {
  const [displayedValue, setDisplayedValue] = useState(
    formatValueToDisplayedValue(value),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldSelectAfterUpdate = useRef(false);
  const isEscaping = useRef(false);

  useEffect(() => {
    setDisplayedValue(formatValueToDisplayedValue(value));
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
      const numericValue = Number(processedValue);

      if (isNaN(numericValue)) {
        setDisplayedValue(String(value));
        return;
      }

      let adjustedValue = roundToNearestIntegerMethod(numericValue);
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
    [max, min, onChange, roundToNearestIntegerMethod, value],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = processInputValue(e.target.value);
      setDisplayedValue(newValue);

      // A workaround to detect if the input is caused by native step buttons or arrow
      // keys. Note that nativeEvent won't have inputType property when using native step
      // buttons or arrow keys.
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
    if (isEscaping.current) {
      isEscaping.current = false;
      return;
    }

    onCommit(displayedValue);
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
        shouldSelectAfterUpdate.current = true; // Firefox doesn't trigger select when using arrow keys
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
