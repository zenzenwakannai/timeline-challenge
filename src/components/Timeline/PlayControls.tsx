import _ from "lodash";
import { useCallback, useEffect } from "react";
import { NumberInput } from "./NumberInput";
import { MAX_DURATION, MIN_DURATION, MIN_TIME } from "../../constants";
import { roundToTen } from "../../utils/numbers";

export type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({
  time,
  setTime,
  duration,
  setDuration,
}: PlayControlsProps) => {
  useEffect(() => {
    setTime(_.clamp(time, MIN_TIME, duration));
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
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <NumberInput
          value={time}
          onChange={handleTimeChange}
          roundToNearestIntegerMethod={roundToTen}
          min={MIN_TIME}
          max={duration}
          step={10}
          data-testid="current-time-input"
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInput
          value={duration}
          onChange={handleDurationChange}
          roundToNearestIntegerMethod={roundToTen}
          min={MIN_DURATION}
          max={MAX_DURATION}
          step={10}
          data-testid="duration-input"
        />
        Duration
      </fieldset>
    </div>
  );
};
