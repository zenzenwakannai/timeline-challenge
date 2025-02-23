import { useCallback, useRef, useState, useEffect } from "react";
import { roundToTen } from "../utils/numbers";

type RulerProps = {
  setTime: (time: number) => void;
  duration: number;
};

export const Ruler = ({ setTime, duration }: RulerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const rulerBarRef = useRef<HTMLDivElement>(null);

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
      setIsDragging(true);

      const newTime = calculateTimeFromMousePosition(e.clientX);
      setTime(newTime);
    },
    [calculateTimeFromMousePosition, setTime],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) {
        return;
      }

      const newTime = calculateTimeFromMousePosition(e.clientX);
      setTime(newTime);
    },
    [calculateTimeFromMousePosition, isDragging, setTime],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className="min-w-0 overflow-x-auto overflow-y-hidden border-b border-solid border-gray-700 px-4 py-2"
      data-testid="ruler"
    >
      <div
        ref={rulerBarRef}
        className="h-6 rounded-md bg-white/25"
        style={{ width: `${duration}px` }}
        onMouseDown={handleMouseDown}
        data-testid="ruler-bar"
      ></div>
    </div>
  );
};
