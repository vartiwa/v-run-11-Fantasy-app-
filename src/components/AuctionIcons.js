"use client";

// Reusable, crisp bespoke SVG vector icons for the V-RUN 11 Auction Room

export function GavelIcon({ className = "w-5 h-5", isStriking = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${isStriking ? "animate-gavel-strike" : ""} transition-transform`}
    >
      <path
        d="M14.5 13.5L4 24l-2-2 10.5-10.5"
        stroke="#854d0e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="5.5" y1="20.5" x2="7.5" y2="22.5" stroke="#ca8a04" strokeWidth="1" />
      <line x1="7.5" y1="18.5" x2="9.5" y2="20.5" stroke="#ca8a04" strokeWidth="1" />
      <rect
        x="11"
        y="1"
        width="11"
        height="7"
        rx="1.5"
        transform="rotate(45 11 1)"
        fill="#78350f"
        stroke="#451a03"
        strokeWidth="1.2"
      />
      <line
        x1="12.5"
        y1="9"
        x2="17.5"
        y2="4"
        stroke="#eab308"
        strokeWidth="2"
      />
      {isStriking && (
        <>
          <path d="M2 17c1-2 2-3 4-3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          <path d="M1 13c2-2 4-3 7-3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

export function SoundSpeakerIcon({ isMuted = false, className = "w-4 h-4" }) {
  if (isMuted) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
        <line x1="23" y1="9" x2="17" y2="15" stroke="#ef4444" strokeWidth="2.5" />
        <line x1="17" y1="9" x2="23" y2="15" stroke="#ef4444" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.2" />
      <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" />
      <path d="M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function AudioEqualizer({ isMuted = false, className = "h-3.5 flex items-end gap-0.5" }) {
  if (isMuted) {
    return (
      <div className={className}>
        <span className="w-1 h-1 bg-slate-400 rounded-full" />
        <span className="w-1 h-1 bg-slate-400 rounded-full" />
        <span className="w-1 h-1 bg-slate-400 rounded-full" />
      </div>
    );
  }

  return (
    <div className={className}>
      <span className="w-0.5 sm:w-1 bg-[#047857] rounded-full animate-eq-1 h-2" />
      <span className="w-0.5 sm:w-1 bg-amber-500 rounded-full animate-eq-2 h-3" />
      <span className="w-0.5 sm:w-1 bg-[#047857] rounded-full animate-eq-3 h-1.5" />
      <span className="w-0.5 sm:w-1 bg-emerald-500 rounded-full animate-eq-4 h-3.5" />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes eq1 { 0%, 100% { height: 4px; } 50% { height: 12px; } }
            @keyframes eq2 { 0%, 100% { height: 14px; } 50% { height: 6px; } }
            @keyframes eq3 { 0%, 100% { height: 8px; } 50% { height: 14px; } }
            @keyframes eq4 { 0%, 100% { height: 12px; } 50% { height: 5px; } }
            .animate-eq-1 { animation: eq1 0.7s ease-in-out infinite; }
            .animate-eq-2 { animation: eq2 0.5s ease-in-out infinite; }
            .animate-eq-3 { animation: eq3 0.8s ease-in-out infinite; }
            .animate-eq-4 { animation: eq4 0.6s ease-in-out infinite; }
          `,
        }}
      />
    </div>
  );
}

export function RupeeCoinIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="8" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="1.5 1.5" />
      <path
        d="M8.5 7h7M8.5 9.5h7M8.5 7c1.5 0 3 .5 3 2.5s-1.5 2.5-3 2.5h1.5l3.5 5"
        stroke="#92400e"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CrownIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 19h20M4 19l2-13 5 6 5-6 2 13H4z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

export function TrophyIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
      <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
      <path d="M4 3h16v6a8 8 0 0 1-16 0V3z" fill="currentColor" fillOpacity="0.15" />
      <path d="M12 17v4M8 21h8" />
    </svg>
  );
}

export function BoltIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function ClockIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function HandStopIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
      <path d="M14 10V4a2 2 0 0 0-4 0v7" />
      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
      <path d="M6 14a6 6 0 0 0 12 0v-3a2 2 0 0 0-4 0" />
      <path d="M6 14l-2-2a2 2 0 0 0-3 3l5 5a8 8 0 0 0 12 0" />
    </svg>
  );
}

export function CricketBatIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 20l10-10 3 3-10 10-3-3z" fill="currentColor" fillOpacity="0.15" />
      <path d="M14 10l3-3 2 2-3 3" />
      <path d="M19 5l2-2" />
      <circle cx="5" cy="5" r="2.5" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}

export function DiceIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function ShieldIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

export function DoorExitIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export function ResetIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <polyline points="21 3 21 8 16 8" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <polyline points="3 21 3 16 8 16" />
    </svg>
  );
}

export function NextTrackIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" fillOpacity="0.2" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </svg>
  );
}

export function PlaneIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

export function StarIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function CheckIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.9 4.9L19 10l-5.1 2.1L12 17l-1.9-4.9L5 10l5.1-2.1L12 3z" fill="currentColor" fillOpacity="0.2" />
      <path d="M19 17l.9 1.9L22 20l-2.1.9L19 23l-.9-1.9L16 20l2.1-.9L19 17z" />
      <path d="M5 3l.9 1.9L8 6l-2.1.9L5 9l-.9-1.9L2 6l2.1-.9L5 3z" />
    </svg>
  );
}

export function TargetIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

export function UsersIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function CopyIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.12c-.24.68-1.21 1.25-1.74 1.28-.48.03-1.09.05-3.54-.95-2.09-.85-3.44-3-3.54-3.14-.1-.14-.85-1.13-.85-2.16 0-1.03.54-1.54.73-1.75.19-.21.42-.26.56-.26.14 0 .28 0 .4.01.13.01.3-.05.47.36.18.42.61 1.48.66 1.59.05.11.08.24.01.38-.07.14-.11.23-.22.36-.11.13-.23.29-.33.39-.11.11-.23.23-.1.45.13.22.58.96 1.25 1.56.86.77 1.59 1.01 1.81 1.12.22.11.35.09.48-.06.13-.15.56-.65.71-.87.15-.22.3-.18.5-.11.2.07 1.28.6 1.5.71.22.11.37.17.42.26.05.09.05.53-.19 1.21z" />
    </svg>
  );
}

export function ChevronRightIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
