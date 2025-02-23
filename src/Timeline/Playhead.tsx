type PlayheadProps = {
  time: number;
};

export const Playhead = ({ time }: PlayheadProps) => {
  return (
    <div
      className="absolute left-[316px] z-10 h-full border-l-2 border-solid border-yellow-600"
      data-testid="playhead"
      style={{ transform: `translateX(calc(${time}px - 50%))` }}
    >
      <div className="absolute -translate-x-1.5 border-[5px] border-solid border-transparent border-t-yellow-600" />
    </div>
  );
};
