import { useState, useEffect } from 'react';

const pad = (n) => String(n).padStart(2, '0');

/**
 * useClock — returns { time: "HH:MM", date: "Weekday, Month DD" }
 * and re-renders every second.
 */
export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  // Long form for LockScreen: "Wednesday, May 13"
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  });

  // Short form for taskbar Clock: "13/05/26"
  const shortDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${String(now.getFullYear()).slice(2)}`;

  return { time, date, shortDate };
}
