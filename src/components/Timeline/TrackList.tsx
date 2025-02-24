import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export type TrackListProps = {
  onScroll: (e: React.UIEvent) => void;
};

export type TrackListHandle = {
  setScrollTop: (scrollTop: number) => void;
};

export const TrackList = forwardRef<TrackListHandle, TrackListProps>(
  ({ onScroll }, ref) => {
    const trackListRef = useRef<HTMLDivElement>(null);

    const setScrollTop = useCallback((scrollTop: number) => {
      requestAnimationFrame(() => {
        if (trackListRef.current) {
          trackListRef.current.scrollTop = scrollTop;
        }
      });
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setScrollTop,
      }),
      [setScrollTop],
    );

    return (
      <div
        ref={trackListRef}
        className="relative grid select-none grid-flow-row auto-rows-[40px] overflow-auto border-r border-solid border-r-gray-700"
        onScroll={onScroll}
        data-testid="track-list"
      >
        <div className="p-2">
          <div>Track A</div>
        </div>
        <div className="p-2">
          <div>Track B</div>
        </div>
        <div className="p-2">
          <div>Track C</div>
        </div>
        <div className="p-2">
          <div>Track D</div>
        </div>
        <div className="p-2">
          <div>Track E</div>
        </div>
        <div className="p-2">
          <div>Track F </div>
        </div>
        <div className="p-2">
          <div>Track G</div>
        </div>
        <div className="p-2">
          <div>Track H</div>
        </div>
        <div className="p-2">
          <div>Track I </div>
        </div>
        <div className="p-2">
          <div>Track J</div>
        </div>
      </div>
    );
  },
);

TrackList.displayName = "TrackList";
