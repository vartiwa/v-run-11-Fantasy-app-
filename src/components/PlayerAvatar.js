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

// Bespoke, handcrafted cricket iconography and role styling
const ROLE_CONFIG = {
  Batsman: {
    gradient: "from-amber-50 via-amber-100/50 to-orange-50",
    border: "border-amber-300/80",
    accent: "#d97706",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    jersey: "#f59e0b",
    icon: (
      // Willow cricket bat with grip & ball trajectory
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Bat handle */}
        <path d="M19 5l-2.5-2.5a1 1 0 00-1.4 0l-1.6 1.6 3.9 3.9 1.6-1.6a1 1 0 000-1.4z" fill="#d97706" fillOpacity="0.2" />
        {/* Bat blade */}
        <path d="M13.5 4.1L4.2 13.4a2 2 0 00-.5 1.1l-.7 4.8a.5.5 0 00.6.6l4.8-.7a2 2 0 001.1-.5l9.3-9.3-4.8-4.8z" fill="currentColor" fillOpacity="0.15" />
        {/* Grip wrapping rings */}
        <line x1="16.5" y1="4.5" x2="18.5" y2="6.5" strokeWidth="1.2" />
        <line x1="15.2" y1="5.8" x2="17.2" y2="7.8" strokeWidth="1.2" />
        {/* Ball trajectory arc */}
        <path d="M3 10c0-4 4-8 9-8" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="13" cy="2" r="1.5" fill="#d97706" />
      </svg>
    ),
  },
  Bowler: {
    gradient: "from-emerald-50 via-emerald-100/50 to-teal-50",
    border: "border-emerald-300/80",
    accent: "#059669",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    jersey: "#10b981",
    icon: (
      // Detailed leather cricket ball with curved stitched seam
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9.5" fill="currentColor" fillOpacity="0.1" />
        {/* Prominent stitched raised seam */}
        <path d="M5.5 5.5C9 9 15 15 18.5 18.5" strokeWidth="2.2" stroke="#059669" />
        {/* Cross stitches on seam */}
        <line x1="7" y1="9" x2="9" y2="7" strokeWidth="1.4" />
        <line x1="10" y1="12" x2="12" y2="10" strokeWidth="1.4" />
        <line x1="13" y1="15" x2="15" y2="13" strokeWidth="1.4" />
        <line x1="16" y1="18" x2="18" y2="16" strokeWidth="1.4" />
        {/* Seam halo glow */}
        <path d="M3 12a9 9 0 0118 0" strokeDasharray="1.5 2.5" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
  },
  "Wicket Keeper": {
    gradient: "from-sky-50 via-sky-100/50 to-blue-50",
    border: "border-sky-300/80",
    accent: "#0284c7",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
    jersey: "#0ea5e9",
    icon: (
      // Authentic Cricket Stumps with Bails + Wicketkeeper Gloves Webbing
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Stumps Base Line */}
        <line x1="3" y1="21" x2="21" y2="21" strokeWidth="2" />
        {/* Left stump */}
        <line x1="7" y1="6" x2="7" y2="21" strokeWidth="2" />
        {/* Middle stump */}
        <line x1="12" y1="6" x2="12" y2="21" strokeWidth="2" />
        {/* Right stump */}
        <line x1="17" y1="6" x2="17" y2="21" strokeWidth="2" />
        {/* Bails on top */}
        <line x1="5.5" y1="6" x2="12" y2="6" strokeWidth="2.5" stroke="#0284c7" />
        <line x1="12" y1="6" x2="18.5" y2="6" strokeWidth="2.5" stroke="#0284c7" />
        {/* Wicket-keeper glove outline silhouette behind */}
        <path d="M12 2a4 4 0 00-4 4v1h8V6a4 4 0 00-4-4z" fill="#0284c7" fillOpacity="0.2" />
      </svg>
    ),
  },
  "All-Rounder": {
    gradient: "from-indigo-50 via-purple-100/50 to-indigo-50",
    border: "border-indigo-300/80",
    accent: "#4f46e5",
    badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
    jersey: "#6366f1",
    icon: (
      // Dynamic Crossed Bat, Ball & Lightning Bolt Crest
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Crossed bat */}
        <path d="M16 3l5 5-9 9-4 1 1-4 7-11z" fill="currentColor" fillOpacity="0.15" />
        {/* Ball on opposite side */}
        <circle cx="6" cy="18" r="4" fill="#4f46e5" fillOpacity="0.2" stroke="#4f46e5" strokeWidth="1.5" />
        <path d="M4 16c2 1 3 2 4 4" stroke="#4f46e5" strokeWidth="1.2" />
        {/* Electric all-round energy crest */}
        <path d="M13 2L6 11h5l-2 7 9-11h-5l2-5z" fill="#4f46e5" stroke="#4f46e5" strokeWidth="1.2" />
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
    <div className="relative flex items-center justify-center select-none shrink-0 group transition-transform duration-300 hover:scale-[1.02]">
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-bold relative overflow-hidden border ${config.border} shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_18px_rgba(0,0,0,0.06)] bg-white`}
      >
        {!showFallback ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            onError={() => setHasError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* High-Craft Bespoke Athlete SVG Vector Fallback */
          <div className={`w-full h-full bg-gradient-to-b ${config.gradient} flex flex-col items-center justify-between p-1.5 relative overflow-hidden`}>
            
            {/* Athletic Stadium Lights & Cricket Field Arcs */}
            <svg
              className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {/* Stadium Floodlight Cones */}
              <polygon points="0,0 35,100 0,100" fill={config.accent} opacity="0.4" />
              <polygon points="100,0 65,100 100,100" fill={config.accent} opacity="0.4" />
              {/* Boundary / Crease Rings */}
              <circle cx="50" cy="50" r="46" fill="none" stroke={config.accent} strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Cricket Action Silhouette (Torso + Head + Bat/Arm in Motion) */}
              <path
                d="M50 24 C55 24 59 28 59 34 C59 39 55 43 50 43 C45 43 41 39 41 34 C41 28 45 24 50 24 Z M22 100 C22 75 35 63 50 63 C65 63 78 75 78 100 Z"
                fill={config.accent}
              />
            </svg>

            {/* Top Role Icon Badge with Glassmorphism */}
            {size !== "sm" && (
              <div
                className="w-5 h-5 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center p-1 text-slate-800 shadow-xs z-10 border border-white/60 transition-transform duration-200 group-hover:rotate-6"
                title={role}
              >
                {config.icon}
              </div>
            )}

            {/* Monogram Display */}
            <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
              <span className={`font-bold tracking-tight text-[#121417] leading-none drop-shadow-2xs ${oswald.className}`}>
                {initials}
              </span>
              {size === "lg" || size === "xl" ? (
                <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-600 mt-1 px-1.5 py-0.5 rounded bg-white/80 border border-black/5 shadow-2xs">
                  {role}
                </span>
              ) : null}
            </div>

            {/* Bottom Accent Plaque */}
            <div
              className="w-full h-1 rounded-full z-10 shadow-xs"
              style={{ backgroundColor: config.accent }}
            />
          </div>
        )}
      </div>

      {/* Country Flag Badge with Realistic Pin */}
      {flag && size !== "sm" && (
        <span className="absolute -bottom-1 -right-1 bg-white border border-black/10 rounded-full px-1.5 py-0.5 text-[10px] shadow-xs z-20 transition-transform group-hover:scale-110">
          {flag}
        </span>
      )}
    </div>
  );
}
