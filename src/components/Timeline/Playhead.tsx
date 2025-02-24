import { useMemo, useRef } from "react";

export type PlayheadProps = {
  time: number;
  horizontalPadding: number;
  scrollLeft: number;
  viewportWidth: number;
};

export const Playhead = ({
  time,
  horizontalPadding,
  scrollLeft,
  viewportWidth,
}: PlayheadProps) => {
  const playheadRef = useRef<HTMLDivElement>(null);

  const isVisible = useMemo(() => {
    return (
      time - scrollLeft >= -horizontalPadding &&
      time - scrollLeft <= viewportWidth
    );
  }, [horizontalPadding, scrollLeft, time, viewportWidth]);

  return (
    <div
      ref={playheadRef}
      className="absolute z-10 h-full border-l-2 border-solid border-yellow-600"
      style={{
        left: 300 + horizontalPadding,
        transform: `translateX(calc(${time - scrollLeft}px - 50%))`,
      }}
      hidden={!isVisible}
      data-testid="playhead"
    >
      <div className="absolute -translate-x-1.5 border-[5px] border-solid border-transparent border-t-yellow-600" />
    </div>
  );
};
