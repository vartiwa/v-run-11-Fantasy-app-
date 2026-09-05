"use client";

import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800", "900"] });

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

  // Generate 12 radial chronograph tick marks
  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 * Math.PI) / 180;
    const rInner = radius - 7;
    const rOuter = radius - 3;
    const x1 = size / 2 + rInner * Math.cos(angle);
    const y1 = size / 2 + rInner * Math.sin(angle);
    const x2 = size / 2 + rOuter * Math.cos(angle);
    const y2 = size / 2 + rOuter * Math.sin(angle);
    return { x1, y1, x2, y2, isQuarter: i % 3 === 0 };
  });

  return (
    <div className={`relative w-full bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] border rounded-3xl p-4 flex flex-col justify-between shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] select-none text-[#12241b] transition-all duration-300 ${
      isTimeUp
        ? "border-rose-400 ring-4 ring-rose-400/20"
        : isWarning
        ? "border-amber-400 ring-4 ring-amber-400/20"
        : "border-[#c6ded0] ring-1 ring-[#059669]/10"
    }`}>
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#cfe0d5]">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-xs ${
              isTimeUp
                ? "bg-rose-500 animate-ping"
                : isWarning
                ? "bg-amber-500 animate-ping"
                : "bg-[#059669] shadow-[0_0_8px_#059669]"
            }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0f5132]">
            AUCTION CHRONOMETER
          </span>
        </div>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-xs transition-colors ${
            isTimeUp
              ? "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse"
              : isWarning
              ? "bg-amber-50 text-amber-800 border border-amber-300 animate-pulse"
              : "bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0]"
          }`}
        >
          {isTimeUp ? "Final Call • Gavel Pending" : isWarning ? "Fair Warning (Going Twice)" : "Clock Active"}
        </span>
      </div>

      {/* Center Chronometer Well with Circular Gauge */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(18,64,50,0.1)]">
          <svg width={size} height={size} className="-rotate-90 transform">
            {/* Outer Luxury Bezel Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 3}
              stroke="#badbc6"
              strokeOpacity={0.6}
              strokeWidth={1}
              fill="transparent"
            />

            {/* Background Dial Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2ede5"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Precision Chronometer Radial Tick Marks */}
            {tickMarks.map((tick, i) => (
              <line
                key={i}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.isQuarter ? "#059669" : "#a8c9b5"}
                strokeWidth={tick.isQuarter ? 1.5 : 1}
              />
            ))}

            {/* Animated Active Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isTimeUp ? "#e11d48" : isWarning ? "#d97706" : "#059669"}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(5,150,105,0.4)]"
            />
          </svg>

          {/* Center Digital Clock in Circular Core */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-black tracking-tight font-mono ${
                isTimeUp ? "text-rose-600 animate-pulse" : isWarning ? "text-amber-700" : "text-[#0e2c1e]"
              } ${outfit.className}`}
            >
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[9px] font-bold text-[#5c7567] uppercase tracking-wider -mt-0.5">
              REMAINING
            </span>
          </div>
        </div>

        {/* Chronometer Stats & Gavel Rules */}
        <div className="flex-1 pl-4 flex flex-col justify-center space-y-1.5">
          <div className="bg-[#eef5f1] border border-[#cbe0d3] rounded-xl p-2 shadow-inner flex justify-between items-center text-xs">
            <span className="text-[10px] text-[#5c7567] font-semibold uppercase">Clock Window:</span>
            <span className="font-bold text-[#0e2c1e] font-mono">{secondsLeft !== null ? `${secondsLeft}s` : "--"}</span>
          </div>

          <div className="bg-[#eef5f1] border border-[#cbe0d3] rounded-xl p-2 shadow-inner flex justify-between items-center text-xs">
            <span className="text-[10px] text-[#5c7567] font-semibold uppercase">Anti-Snipe:</span>
            <span className="font-bold text-[#047857] font-sans">+15s Fair Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
