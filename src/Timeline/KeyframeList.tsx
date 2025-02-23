import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { Segment } from "./Segment";

export type KeyframeListProps = {
  duration: number;
  onScroll: (e: React.UIEvent) => void;
};

export type KeyframeListHandle = {
  setScrollLeft: (scrollLeft: number) => void;
  setScrollTop: (scrollTop: number) => void;
};

export const KeyframeList = forwardRef<KeyframeListHandle, KeyframeListProps>(
  ({ duration, onScroll }, ref) => {
    const keyframeListRef = useRef<HTMLDivElement>(null);

    const setScrollLeft = useCallback((scrollLeft: number) => {
      if (!keyframeListRef.current) {
        return;
      }

      keyframeListRef.current.scrollLeft = scrollLeft;
    }, []);

    const setScrollTop = useCallback((scrollTop: number) => {
      if (!keyframeListRef.current) {
        return;
      }

      keyframeListRef.current.scrollTop = scrollTop;
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
        className="min-w-0 overflow-auto px-4"
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
