import { useCallback, useState } from "react";
import { NumberInput } from "./NumberInput";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  // TODO: implement time <= maxTime
  const [duration, setDuration] = useState(2000);

  const onTimeChange = useCallback(
    (value: number) => {
      setTime(value);
    },
    [setTime],
  );

  const onDurationChange = useCallback(
    (value: number) => {
      setDuration(value);
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
          onChange={onTimeChange}
          min={0}
          max={2000}
          step={10}
          data-testid="current-time-input"
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <NumberInput
          value={duration}
          onChange={onDurationChange}
          min={100}
          max={2000}
          step={10}
          data-testid="duration-input"
        />
        Duration
      </fieldset>
    </div>
  );
};
