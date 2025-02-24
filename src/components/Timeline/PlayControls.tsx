import { clamp } from "lodash";
import { memo, useCallback, useEffect } from "react";
import { NumberInput } from "./NumberInput";
import { MAX_DURATION, MIN_DURATION, MIN_TIME } from "../../constants";
import { roundToTen } from "../../utils/numbers";

export type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = memo(
  ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
    useEffect(() => {
      setTime(clamp(time, MIN_TIME, duration));
    }, [duration, setTime, time]);

    const handleTimeChange = useCallback(
      (newTime: number) => {
        setTime(newTime);
      },
      [setTime],
    );

    const handleDurationChange = useCallback(
      (newDuration: number) => {
        setDuration(newDuration);
      },
      [setDuration],
    );

    return (
      <div
        className="flex select-none items-center justify-between border-b border-r border-solid border-gray-700 px-2"
        data-testid="play-controls"
        role="group"
        aria-label="Play Controls"
      >
        <fieldset className="flex gap-1">
          <legend className="sr-only">Current Time Setting</legend>
          Current
          <NumberInput
            value={time}
            onChange={handleTimeChange}
            roundToNearestIntegerMethod={roundToTen}
            min={MIN_TIME}
            max={duration}
            step={10}
            data-testid="current-time-input"
            aria-label="Current Time"
            aria-valuemin={MIN_TIME}
            aria-valuemax={duration}
            aria-valuenow={time}
          />
        </fieldset>
        -
        <fieldset className="flex gap-1">
          <legend className="sr-only">Duration Setting</legend>
          <NumberInput
            value={duration}
            onChange={handleDurationChange}
            roundToNearestIntegerMethod={roundToTen}
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={10}
            data-testid="duration-input"
            aria-label="Duration"
            aria-valuemin={MIN_DURATION}
            aria-valuemax={MAX_DURATION}
            aria-valuenow={duration}
          />
          Duration
        </fieldset>
      </div>
    );
  },
);

PlayControls.displayName = "PlayControls";
