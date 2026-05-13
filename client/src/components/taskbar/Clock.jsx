import { useClock } from '../../hooks/useClock';

/**
 * Clock — stacked HH:MM / DD/MM/YY display for the taskbar system tray.
 */
export function Clock() {
  const { time, shortDate } = useClock();

  return (
    <div className="flex flex-col items-end justify-center leading-none select-none cursor-default px-2">
      <span className="text-white text-[11px] font-medium">{time}</span>
      <span className="text-white/70 text-[11px] mt-[2px]">{shortDate}</span>
    </div>
  );
}
