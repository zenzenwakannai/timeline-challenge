import { range } from "lodash";
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Segment } from "./Segment";
import { TIMELINE_HORIZONTAL_SPACING } from "../../constants";

export type KeyframeListProps = {
  duration: number;
  onScroll: (e: React.UIEvent) => void;
};

export type KeyframeListHandle = {
  getScrollLeft: () => number | undefined;
  getScrollTop: () => number | undefined;
  setScrollLeft: (scrollLeft: number) => void;
  setScrollTop: (scrollTop: number) => void;
};

export const KeyframeList = memo(
  forwardRef<KeyframeListHandle, KeyframeListProps>(
    ({ duration, onScroll }, ref) => {
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
          getScrollLeft: () => keyframeListRef.current?.scrollLeft,
          getScrollTop: () => keyframeListRef.current?.scrollTop,
          setScrollLeft,
          setScrollTop,
        }),
        [setScrollLeft, setScrollTop],
      );

      return (
        <div
          ref={keyframeListRef}
          className="min-w-0 overflow-auto will-change-scroll"
          style={{
            paddingLeft: TIMELINE_HORIZONTAL_SPACING,
            paddingRight: TIMELINE_HORIZONTAL_SPACING,
          }}
          onScroll={onScroll}
          data-testid="keyframe-list"
          role="group"
          aria-label="Keyframe List"
        >
          {range(10).map((index) => (
            <Segment key={index} duration={duration} />
          ))}
        </div>
      );
    },
  ),
);

KeyframeList.displayName = "KeyframeList";
