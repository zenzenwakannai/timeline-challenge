import { useEffect, useRef, useState } from "react";
import { Playhead } from "./Playhead";
import { Ruler, RulerHandle } from "./Ruler";
import { TrackList, TrackListHandle } from "./TrackList";
import { KeyframeList, KeyframeListHandle } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

const horizontalPadding = 16;

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const timelineRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<RulerHandle>(null);
  const trackListRef = useRef<TrackListHandle>(null);
  const keyframeListRef = useRef<KeyframeListHandle>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    if (timelineRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];

        if (entry) {
          // 300px is the width of PlayControls/TrackList
          setViewportWidth(entry.contentRect.width - 300);
        }
      });

      resizeObserver.observe(timelineRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  const handleRulerScroll = (e: React.UIEvent) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const { scrollLeft: newScrollLeft } = e.currentTarget;
    keyframeListRef.current?.setScrollLeft(newScrollLeft);
    setScrollLeft(newScrollLeft);

    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  const handleTrackListScroll = (e: React.UIEvent) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const { scrollTop } = e.currentTarget;
    keyframeListRef.current?.setScrollTop(scrollTop);

    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  const handleKeyframeListScroll = (e: React.UIEvent) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const { scrollLeft: newScrollLeft, scrollTop } = e.currentTarget;
    rulerRef.current?.setScrollLeft(newScrollLeft);
    trackListRef.current?.setScrollTop(scrollTop);
    setScrollLeft(newScrollLeft);

    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  return (
    <div
      ref={timelineRef}
      className="relative z-0 grid h-[300px] w-full grid-cols-[300px_1fr] grid-rows-[40px_1fr] border-t-2 border-solid border-gray-700 bg-gray-800"
      data-testid="timeline"
    >
      <PlayControls
        time={time}
        setTime={setTime}
        duration={duration}
        setDuration={setDuration}
      />
      <Ruler
        ref={rulerRef}
        horizontalPadding={horizontalPadding}
        setTime={setTime}
        duration={duration}
        onScroll={handleRulerScroll}
      />
      <TrackList ref={trackListRef} onScroll={handleTrackListScroll} />
      <KeyframeList
        ref={keyframeListRef}
        horizontalPadding={horizontalPadding}
        duration={duration}
        onScroll={handleKeyframeListScroll}
      />
      <Playhead
        time={time}
        horizontalPadding={horizontalPadding}
        scrollLeft={scrollLeft}
        viewportWidth={viewportWidth}
      />
    </div>
  );
};
