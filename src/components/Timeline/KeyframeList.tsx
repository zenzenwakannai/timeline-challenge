import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Segment } from "./Segment";

export type KeyframeListProps = {
  horizontalPadding: number;
  duration: number;
  onScroll: (e: React.UIEvent) => void;
};

export type KeyframeListHandle = {
  setScrollLeft: (scrollLeft: number) => void;
  setScrollTop: (scrollTop: number) => void;
};

export const KeyframeList = forwardRef<KeyframeListHandle, KeyframeListProps>(
  ({ horizontalPadding, duration, onScroll }, ref) => {
    const keyframeListRef = useRef<HTMLDivElement>(null);

    const setScrollLeft = useCallback((scrollLeft: number) => {
      requestAnimationFrame(() => {
        if (keyframeListRef.current) {
          keyframeListRef.current.scrollLeft = scrollLeft;
        }
      });
    }, []);

    const setScrollTop = useCallback((scrollTop: number) => {
      requestAnimationFrame(() => {
        if (keyframeListRef.current) {
          keyframeListRef.current.scrollTop = scrollTop;
        }
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setScrollLeft,
        setScrollTop,
      }),
      [setScrollLeft, setScrollTop],
    );

    return (
      <div
        ref={keyframeListRef}
        className="min-w-0 overflow-auto"
        style={{
          paddingLeft: horizontalPadding,
          paddingRight: horizontalPadding,
        }}
        onScroll={onScroll}
        data-testid="keyframe-list"
      >
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
        <Segment duration={duration} />
      </div>
    );
  },
);

KeyframeList.displayName = "KeyframeList";
