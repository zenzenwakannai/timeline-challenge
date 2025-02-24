import { memo, useRef } from "react";
import {
  CONTROLS_COLUMN_WIDTH,
  MIN_DURATION,
  TIMELINE_HORIZONTAL_SPACING,
} from "../../constants";

export type PlayheadProps = {
  time: number;
  duration: number;
  scrollLeft: number;
  rulerWidth: number;
};

export const Playhead = memo(
  ({ time, duration, scrollLeft, rulerWidth }: PlayheadProps) => {
    const playheadRef = useRef<HTMLDivElement>(null);

    const isVisible =
      time + TIMELINE_HORIZONTAL_SPACING - scrollLeft >= 0 &&
      time + TIMELINE_HORIZONTAL_SPACING - scrollLeft <= rulerWidth;

    return (
      <div
        ref={playheadRef}
        className="absolute z-10 h-full border-l-2 border-solid border-yellow-600 will-change-transform"
        style={{
          left: CONTROLS_COLUMN_WIDTH + TIMELINE_HORIZONTAL_SPACING,
          transform: `translateX(calc(${time - scrollLeft}px - 50%))`,
        }}
        hidden={!isVisible}
        data-testid="playhead"
        role="slider"
        aria-label="Playhead"
        aria-valuemin={MIN_DURATION}
        aria-valuemax={duration}
        aria-valuenow={time}
        aria-orientation="horizontal"
      >
        <div className="absolute -translate-x-1.5 border-[5px] border-solid border-transparent border-t-yellow-600" />
      </div>
    );
  },
);

Playhead.displayName = "Playhead";
