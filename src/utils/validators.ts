export type ValidatorFunction = ({
  displayedValue,
  min,
  max,
  step,
}: {
  displayedValue: string;
  min?: number;
  max?: number;
  step?: number;
}) => boolean;

export const defaultValidator: ValidatorFunction = ({
  displayedValue,
  min,
  max,
  step,
}) => {
  const value = Number(displayedValue);

  if (isNaN(value)) {
    return false;
  }

  if (min !== undefined && value < min) {
    return false;
  }

  if (max !== undefined && value > max) {
    return false;
  }

  if (step !== undefined && value % step !== 0) {
    return false;
  }

  return true;
};
