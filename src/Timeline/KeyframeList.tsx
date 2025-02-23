import { forwardRef, useImperativeHandle, useRef } from "react";
import { Segment } from "./Segment";

export type KeyframeListProps = {
  onScroll: (e: React.UIEvent) => void;
};

export type KeyframeListHandle = {
  setScrollLeft: (scrollLeft: number) => void;
};

export const KeyframeList = forwardRef<KeyframeListHandle, KeyframeListProps>(
  ({ onScroll }, ref) => {
    // TODO: implement scroll sync with `Ruler` and `TrackList`

    const keyframeListRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      setScrollLeft: (scrollLeft: number) => {
        if (!keyframeListRef.current) {
          return;
        }

        keyframeListRef.current.scrollLeft = scrollLeft;
      },
    }));

    return (
      <div
        ref={keyframeListRef}
        className="min-w-0 overflow-auto px-4"
        onScroll={onScroll}
        data-testid="keyframe-list"
      >
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
        <Segment />
      </div>
    );
  },
);

KeyframeList.displayName = "KeyframeList";
