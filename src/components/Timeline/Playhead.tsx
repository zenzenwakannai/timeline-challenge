import { useRef } from "react";

export type PlayheadProps = {
  time: number;
  horizontalPadding: number;
  scrollLeft: number;
  rulerWidth: number;
};

export const Playhead = ({
  time,
  horizontalPadding,
  scrollLeft,
  rulerWidth,
}: PlayheadProps) => {
  const playheadRef = useRef<HTMLDivElement>(null);

  const isVisible =
    time + horizontalPadding - scrollLeft >= 0 &&
    time + horizontalPadding - scrollLeft <= rulerWidth;

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
