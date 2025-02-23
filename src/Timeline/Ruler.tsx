export const Ruler = () => {
  // TODO: implement mousedown and mousemove to update time and Playhead position

  return (
    <div
      className="min-w-0 overflow-x-auto overflow-y-hidden border-b border-solid border-gray-700 px-4 py-2"
      data-testid="ruler"
    >
      <div
        className="h-6 w-[2000px] rounded-md bg-white/25"
        data-testid="ruler-bar"
      ></div>
    </div>
  );
};
