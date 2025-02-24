import classNames from "classnames";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { roundToNearestInteger } from "../../utils/numbers";
import { processInputValue } from "../../utils/strings";
import { defaultValidator, ValidatorFunction } from "../../utils/validators";

const formatValueToDisplayedValue = (value: number) => {
  return String(value);
};

export type NumberInputProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  roundToNearestIntegerMethod?: (value: number) => number;
  validator?: ValidatorFunction;
  "data-testid"?: string;
};

export const NumberInput = ({
  value,
  onChange,
  min,
  max,
  step,
  roundToNearestIntegerMethod = roundToNearestInteger,
  validator = defaultValidator,
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

  const isValid = useMemo(
    () => validator({ displayedValue, min, max, step }),
    [displayedValue, max, min, step, validator],
  );

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
      const newValue = e.target.value;
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleBlur = useCallback(() => {
    if (isEscaping.current) {
      isEscaping.current = false;
      return;
    }

    onCommit(displayedValue);
  }, [displayedValue, onCommit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const { key, altKey, ctrlKey, metaKey, shiftKey } = e;

      if (
        /^[A-Za-z]$/.test(key) &&
        !altKey &&
        !ctrlKey &&
        !metaKey &&
        !shiftKey
      ) {
        e.preventDefault();
        return;
      }

      switch (key) {
        case "Enter": {
          e.preventDefault();

          onCommit(displayedValue);
          inputRef.current?.blur();
          break;
        }
        case "Escape": {
          e.preventDefault();

          isEscaping.current = true; // Prevent calling onChange in handleBlur
          setDisplayedValue(String(value));
          inputRef.current?.blur();
          break;
        }
        case "ArrowUp":
        case "ArrowDown": {
          e.preventDefault();

          const stepValue = step ?? 1;
          const newValue = String(
            Number(displayedValue) +
              (key === "ArrowUp" ? stepValue : -stepValue),
          );

          setDisplayedValue(newValue);
          onCommit(newValue);
          shouldSelectAfterUpdate.current = true; // Firefox doesn't trigger select when using arrow keys
          break;
        }
        default:
          break;
      }
    },
    [displayedValue, onCommit, step, value],
  );

  return (
    <input
      ref={inputRef}
      className={classNames("rounded bg-gray-700 px-1", {
        "text-red-500": !isValid,
      })}
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
