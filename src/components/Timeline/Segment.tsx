export type SegmentProps = {
  duration: number;
};

export const Segment = ({ duration }: SegmentProps) => {
  return (
    <div
      className="py-2"
      style={{ width: `${duration}px` }}
      data-testid="segment"
      role="presentation"
    >
      <div className="h-6 rounded-md bg-white/10" />
    </div>
  );
};
