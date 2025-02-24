import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";

export type TrackListProps = {
  onScroll: (e: React.UIEvent) => void;
};

export type TrackListHandle = {
  setScrollTop: (scrollTop: number) => void;
};

export const TrackList = memo(
  forwardRef<TrackListHandle, TrackListProps>(({ onScroll }, ref) => {
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
        className="relative grid select-none grid-flow-row auto-rows-[40px] overflow-auto border-r border-solid border-r-gray-700 will-change-scroll"
        onScroll={onScroll}
        data-testid="track-list"
        role="list"
        aria-label="Track List"
      >
        <div className="p-2">
          <div role="listitem">Track A</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track B</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track C</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track D</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track E</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track F </div>
        </div>
        <div className="p-2">
          <div role="listitem">Track G</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track H</div>
        </div>
        <div className="p-2">
          <div role="listitem">Track I </div>
        </div>
        <div className="p-2">
          <div role="listitem">Track J</div>
        </div>
      </div>
    );
  }),
);

TrackList.displayName = "TrackList";
