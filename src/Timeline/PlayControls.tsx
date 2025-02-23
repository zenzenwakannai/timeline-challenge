import React, { useCallback } from "react";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
};

export const PlayControls = ({ time, setTime }: PlayControlsProps) => {
  // TODO: implement time <= maxTime

  const onTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(Number(e.target.value));
    },
    [setTime],
  );

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <input
          className="rounded bg-gray-700 px-1"
          type="number"
          data-testid="current-time-input"
          min={0}
          max={2000}
          step={10}
          value={time}
          onChange={onTimeChange}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          className="rounded bg-gray-700 px-1"
          type="number"
          data-testid="duration-input"
          min={100}
          max={2000}
          step={10}
          defaultValue={2000}
        />
        Duration
      </fieldset>
    </div>
  );
};
