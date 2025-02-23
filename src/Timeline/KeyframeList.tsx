import { Segment } from "./Segment";
export const KeyframeList = () => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div className="min-w-0 overflow-auto px-4" data-testid="keyframe-list">
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
};
