"use client";

import { useState } from "react";
import Image from "next/image";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "700"] });

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PL";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Role-specific sports palettes and iconography
const ROLE_CONFIG = {
  Batsman: {
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    accent: "#d97706",
    jersey: "#f59e0b",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 20l12-12m0 0l2 2-12 12m10-14l2-2 2 2-2 2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  Bowler: {
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    accent: "#059669",
    jersey: "#10b981",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3a9 9 0 010 18M12 3a9 9 0 000 18" strokeDasharray="2 2"/>
      </svg>
    ),
  },
  "Wicket Keeper": {
    gradient: "from-sky-50 to-sky-100",
    border: "border-sky-200",
    accent: "#0284c7",
    jersey: "#0ea5e9",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 11V7a5 5 0 0110 0v4M5 11h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"/>
      </svg>
    ),
  },
  "All-Rounder": {
    gradient: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200",
    accent: "#4f46e5",
    jersey: "#6366f1",
    icon: (
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
};

export default function PlayerAvatar({
  name = "Player",
  role = "Batsman",
  imageUrl,
  size = "md", // 'sm', 'md', 'lg', 'xl'
  flag = "🇮🇳",
}) {
  const [hasError, setHasError] = useState(false);
  const showFallback = !imageUrl || hasError;

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-sm",
    lg: "w-28 h-28 text-xl",
    xl: "w-40 h-40 text-3xl",
  };

  const config = ROLE_CONFIG[role] || ROLE_CONFIG.Batsman;
  const initials = getInitials(name);

  return (
    <div className="relative flex items-center justify-center select-none shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-bold relative overflow-hidden border ${config.border} shadow-[0_2px_4px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)] bg-white`}
      >
        {!showFallback ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            onError={() => setHasError(true)}
            className="object-cover"
          />
        ) : (
          /* High-Craft Bespoke Athlete SVG Vector Fallback */
          <div className={`w-full h-full bg-gradient-to-b ${config.gradient} flex flex-col items-center justify-between p-1.5 relative overflow-hidden`}>
            
            {/* Background Athlete Silhouette / Arc */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke={config.accent} strokeWidth="2" strokeDasharray="3 3"/>
              <path d="M15 100 C15 70 35 60 50 60 C65 60 85 70 85 100 Z" fill={config.accent}/>
              <circle cx="50" cy="38" r="18" fill={config.accent}/>
            </svg>

            {/* Top Role Icon Badge */}
            {size !== "sm" && (
              <div className="w-5 h-5 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center p-1 text-slate-700 shadow-2xs z-10">
                {config.icon}
              </div>
            )}

            {/* Monogram Display */}
            <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
              <span className={`font-bold tracking-tight text-[#121417] leading-none ${oswald.className}`}>
                {initials}
              </span>
              {size === "lg" || size === "xl" ? (
                <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-500 mt-1">
                  {role}
                </span>
              ) : null}
            </div>

            {/* Bottom Color Plaque */}
            <div
              className="w-full h-1 rounded-full z-10"
              style={{ backgroundColor: config.accent }}
            />
          </div>
        )}
      </div>

      {/* Country Flag Badge */}
      {flag && size !== "sm" && (
        <span className="absolute -bottom-1 -right-1 bg-white border border-black/10 rounded-full px-1.5 py-0.5 text-[10px] shadow-2xs z-20">
          {flag}
        </span>
      )}
    </div>
  );
}
