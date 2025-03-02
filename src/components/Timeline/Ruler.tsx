import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { TIMELINE_HORIZONTAL_SPACING } from "../../constants";
import { useThrottle } from "../../utils/hooks";
import { roundToTen } from "../../utils/numbers";

export type RulerProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  onScroll: (e: React.UIEvent) => void;
};

export type RulerHandle = {
  setScrollLeft: (scrollLeft: number) => void;
};

export const Ruler = memo(
  forwardRef<RulerHandle, RulerProps>(
    ({ time, setTime, duration, onScroll }, ref) => {
      const rulerRef = useRef<HTMLDivElement>(null);
      const rulerBarRef = useRef<HTMLDivElement>(null);
      const isDragging = useRef(false);

      const calculateTimeFromMousePosition = useCallback((clientX: number) => {
        if (!rulerBarRef.current) {
          return 0;
        }

        const rect = rulerBarRef.current.getBoundingClientRect();
        const scrollLeft = rulerBarRef.current.scrollLeft;
        const relativeX = clientX - rect.left + scrollLeft;

        return roundToTen(relativeX);
      }, []);

      const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
          isDragging.current = true;

          const newTime = calculateTimeFromMousePosition(e.clientX);
          setTime(newTime);
        },
        [calculateTimeFromMousePosition, setTime],
      );

      const handleMouseMove = useCallback(
        (e: MouseEvent) => {
          if (!isDragging.current) {
            return;
          }

          const newTime = calculateTimeFromMousePosition(e.clientX);
          setTime(newTime);
        },
        [calculateTimeFromMousePosition, setTime],
      );

      const throttledHandleMouseMove = useThrottle(handleMouseMove, 10);

      const handleMouseUp = useCallback(() => {
        if (!isDragging.current) {
          return;
        }

        isDragging.current = false;
      }, []);

      // Prevents mouseMove and mouseUp events from being blocked when the playhead
      // overlaps the ruler.
      useEffect(() => {
        window.addEventListener("mousemove", throttledHandleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
          window.removeEventListener("mousemove", throttledHandleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
        };
      }, [handleMouseUp, throttledHandleMouseMove]);

      const setScrollLeft = useCallback((scrollLeft: number) => {
        requestAnimationFrame(() => {
          if (rulerRef.current) {
            rulerRef.current.scrollLeft = scrollLeft;
          }
        });
      }, []);

      useImperativeHandle(
        ref,
        () => ({
          setScrollLeft,
        }),
        [setScrollLeft],
      );

      return (
        <div
          ref={rulerRef}
          className="min-w-0 overflow-x-auto overflow-y-hidden border-b border-solid border-gray-700 py-2 will-change-scroll"
          style={{
            paddingLeft: TIMELINE_HORIZONTAL_SPACING,
            paddingRight: TIMELINE_HORIZONTAL_SPACING,
          }}
          onScroll={onScroll}
          data-testid="ruler"
          role="region"
          aria-label="Timeline Ruler"
        >
          <div
            ref={rulerBarRef}
            className="h-6 rounded-md bg-white/25"
            style={{ width: `${duration}px` }}
            onMouseDown={handleMouseDown}
            data-testid="ruler-bar"
            role="slider"
            aria-label="Timeline Ruler"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={time}
            aria-orientation="horizontal"
          />
        </div>
      );
    },
  ),
);

Ruler.displayName = "Ruler";
