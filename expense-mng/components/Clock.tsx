"use client";

import { useState, useEffect } from 'react';

export function Clock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format day and date
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[currentTime.getDay()];
  const formattedDate = currentTime.toLocaleDateString('en-EU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Format time (24h format)
  const formattedTime = currentTime.toLocaleTimeString('en-EU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
    <div className="w-full bg-background backdrop-blur-xl border shadow-sm border-background-light rounded-2xl p-6 flex flex-col gap-3">
      {/* Header */}
      <header className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-subheader">
          Current Time
        </span>
      </header>

      {/* Time Display */}
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl md:text-4xl font-mono font-bold text-header tracking-widest">
          {formattedTime}
        </span>
        
        {/* Day & Date */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-subheader font-medium tracking-wide">
            {currentDay}
          </span>
          <span className="text-xs text-body tracking-wide">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}
