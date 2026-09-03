"use client";

import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

export default function CircularTimer({
  secondsLeft = 60,
  totalDuration = 60,
  isWarning = false,
  isTimeUp = false,
}) {
  const current = secondsLeft ?? totalDuration;
  const progressPercent = totalDuration > 0 ? Math.max(0, Math.min(100, (current / totalDuration) * 100)) : 0;

  // SVG Circular Gauge calculations
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const formatTime = (secs) => {
    if (secs === null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl p-4 flex flex-col justify-between shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] select-none text-[#121417]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e8e2d4]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-xs ${
              isTimeUp
                ? "bg-rose-600"
                : isWarning
                ? "bg-amber-500 animate-ping"
                : "bg-[#124032]"
            }`}
          />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#555a60]">
            AUCTION CHRONOMETER
          </span>
        </div>

        <span
          className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs ${
            isTimeUp
              ? "bg-rose-100 text-rose-800 border border-rose-300"
              : isWarning
              ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
              : "bg-[#eef5f1] text-[#124032] border border-[#c3ded0]"
          }`}
        >
          {isTimeUp ? "Round Concluded" : isWarning ? "Fair Warning (Going Twice)" : "Gavel Open"}
        </span>
      </div>

      {/* Center Chronometer Well with Circular Gauge */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]">
          <svg width={size} height={size} className="-rotate-90 transform">
            {/* Background Dial Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e8e2d4"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Animated Active Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isTimeUp ? "#e11d48" : isWarning ? "#d97706" : "#124032"}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Digital Clock in Circular Core */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-bold tracking-tight ${
                isTimeUp ? "text-rose-600" : isWarning ? "text-amber-600" : "text-[#121417]"
              } ${oswald.className}`}
            >
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[9px] font-mono font-bold text-[#8c8577] uppercase tracking-wider -mt-0.5">
              REMAINING
            </span>
          </div>
        </div>

        {/* Chronometer Stats & Gavel Rules */}
        <div className="flex-1 pl-4 flex flex-col justify-center space-y-1.5 font-mono">
          <div className="bg-[#f5f2e9] border border-[#dfd9cb] rounded-xl p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] flex justify-between items-center text-xs">
            <span className="text-[10px] text-[#767c84] uppercase">Clock Window:</span>
            <span className="font-bold text-[#121417]">{secondsLeft !== null ? `${secondsLeft}s` : "--"}</span>
          </div>

          <div className="bg-[#f5f2e9] border border-[#dfd9cb] rounded-xl p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] flex justify-between items-center text-xs">
            <span className="text-[10px] text-[#767c84] uppercase">Anti-Snipe:</span>
            <span className="font-bold text-[#124032]">+15s Fair Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
