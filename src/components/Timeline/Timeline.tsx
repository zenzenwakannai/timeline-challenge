import { useEffect, useRef, useState } from "react";
import { KeyframeList, KeyframeListHandle } from "./KeyframeList";
import { PlayControls } from "./PlayControls";
import { Playhead } from "./Playhead";
import { Ruler, RulerHandle } from "./Ruler";
import { TrackList, TrackListHandle } from "./TrackList";

const horizontalPadding = 16;

export const Timeline = () => {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [rulerWidth, setRulerWidth] = useState(0);

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
          setRulerWidth(entry.contentRect.width - 300);
        }
      });

      resizeObserver.observe(timelineRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  // Prevent browser's swiping to go back feature when the timeline is at the
  // beginning
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollLeft === 0 && time === 0 && e.deltaX < 0) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, [scrollLeft, time]);

  const handleRulerScroll = (e: React.UIEvent) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const { scrollLeft: newScrollLeft } = e.currentTarget;
    keyframeListRef.current?.setScrollLeft(newScrollLeft);
    setScrollLeft(newScrollLeft);

    setTimeout(() => {
      isScrolling.current = false;
    }, 0);
  };

  const handleTrackListScroll = (e: React.UIEvent) => {
    if (isScrolling.current) {
      return;
    }

    isScrolling.current = true;
    const { scrollTop } = e.currentTarget;
    keyframeListRef.current?.setScrollTop(scrollTop);

    setTimeout(() => {
      isScrolling.current = false;
    }, 0);
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

    setTimeout(() => {
      isScrolling.current = false;
    }, 0);
  };

  useEffect(() => {
    if (keyframeListRef.current && rulerRef.current) {
      const keyframeListScrollLeft = keyframeListRef.current.getScrollLeft();

      if (keyframeListScrollLeft !== undefined) {
        rulerRef.current.setScrollLeft(keyframeListScrollLeft);
      }
    }

    if (keyframeListRef.current && trackListRef.current) {
      const keyframeListScrollTop = keyframeListRef.current.getScrollTop();

      if (keyframeListScrollTop !== undefined) {
        trackListRef.current.setScrollTop(keyframeListScrollTop);
      }
    }
  }, []);

  return (
    <div
      ref={timelineRef}
      className="relative grid h-[300px] w-full grid-cols-[300px_1fr] grid-rows-[40px_1fr] border-t-2 border-solid border-gray-700 bg-gray-800"
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
        rulerWidth={rulerWidth}
      />
    </div>
  );
};
