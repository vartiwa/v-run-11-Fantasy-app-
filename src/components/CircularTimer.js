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
    <div className={`relative w-full bg-gradient-to-b from-[#183d2f] via-[#133226] to-[#0e271e] border rounded-3xl p-4 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.45),0_0_35px_rgba(46,133,101,0.22),inset_0_1px_0_rgba(255,255,255,0.18)] select-none text-white transition-all duration-300 ${
      isTimeUp
        ? "border-rose-500 ring-4 ring-rose-500/25"
        : isWarning
        ? "border-amber-400 ring-4 ring-amber-400/25"
        : "border-[#3dd9a5]/35 ring-1 ring-[#d4be8c]/25"
    }`}>
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/50 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/15">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shadow-xs ${
              isTimeUp
                ? "bg-rose-500 animate-ping"
                : isWarning
                ? "bg-amber-400 animate-ping"
                : "bg-[#3dd9a5] shadow-[0_0_8px_#3dd9a5]"
            }`}
          />
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#ebd7aa]">
            AUCTION CHRONOMETER
          </span>
        </div>

        <span
          className={`text-[10px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm transition-colors ${
            isTimeUp
              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
              : isWarning
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
              : "bg-[#184a39] text-[#3dd9a5] border border-[#3dd9a5]/40"
          }`}
        >
          {isTimeUp ? "Final Call • Gavel Pending" : isWarning ? "Fair Warning (Going Twice)" : "Clock Active"}
        </span>
      </div>

      {/* Center Chronometer Well with Circular Gauge */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Circular SVG Gauge */}
        <div className="relative flex items-center justify-center filter drop-shadow-[0_0_16px_rgba(18,64,50,0.4)]">
          <svg width={size} height={size} className="-rotate-90 transform">
            {/* Outer Luxury Bezel Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius + 3}
              stroke="#d4be8c"
              strokeOpacity={0.25}
              strokeWidth={1}
              fill="transparent"
            />

            {/* Background Dial Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.08)"
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
                stroke={tick.isQuarter ? "#d4be8c" : "rgba(255,255,255,0.2)"}
                strokeWidth={tick.isQuarter ? 1.5 : 1}
              />
            ))}

            {/* Animated Active Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isTimeUp ? "#f43f5e" : isWarning ? "#f59e0b" : "#34d399"}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            />
          </svg>

          {/* Center Digital Clock in Circular Core */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`text-2xl font-bold tracking-tight ${
                isTimeUp ? "text-rose-400 animate-pulse" : isWarning ? "text-amber-400" : "text-white"
              } ${oswald.className}`}
            >
              {formatTime(secondsLeft)}
            </span>
            <span className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-wider -mt-0.5">
              REMAINING
            </span>
          </div>
        </div>

        {/* Chronometer Stats & Gavel Rules */}
        <div className="flex-1 pl-4 flex flex-col justify-center space-y-1.5 font-mono">
          <div className="bg-[#10271f] border border-[#3dd9a5]/25 rounded-xl p-2 shadow-inner flex justify-between items-center text-xs">
            <span className="text-[10px] text-white/50 uppercase">Clock Window:</span>
            <span className="font-bold text-white">{secondsLeft !== null ? `${secondsLeft}s` : "--"}</span>
          </div>

          <div className="bg-[#10271f] border border-[#3dd9a5]/25 rounded-xl p-2 shadow-inner flex justify-between items-center text-xs">
            <span className="text-[10px] text-white/50 uppercase">Anti-Snipe:</span>
            <span className="font-bold text-[#3dd9a5]">+15s Fair Warning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
