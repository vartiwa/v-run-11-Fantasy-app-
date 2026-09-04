"use client";

// Reusable, crisp bespoke SVG vector icons for the V-RUN 11 Auction Room

export function GavelIcon({ className = "w-5 h-5", isStriking = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${isStriking ? "animate-gavel-strike" : ""} transition-transform`}
    >
      {/* Turned wooden handle */}
      <path
        d="M14.5 13.5L4 24l-2-2 10.5-10.5"
        stroke="#854d0e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Wooden handle grip rings */}
      <line x1="5.5" y1="20.5" x2="7.5" y2="22.5" stroke="#ca8a04" strokeWidth="1" />
      <line x1="7.5" y1="18.5" x2="9.5" y2="20.5" stroke="#ca8a04" strokeWidth="1" />
      
      {/* Gavel hammerhead block */}
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
      {/* Polished brass center ring */}
      <line
        x1="12.5"
        y1="9"
        x2="17.5"
        y2="4"
        stroke="#eab308"
        strokeWidth="2"
      />
      {/* Sound impact shockwave (when striking or highlighted) */}
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
      {/* Inner sound wave */}
      <path d="M15.54 8.46a5 5 0 010 7.07" stroke="currentColor" strokeWidth="2" />
      {/* Outer sound wave */}
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
      <span className="w-0.5 sm:w-1 bg-[#124032] rounded-full animate-eq-1 h-2" />
      <span className="w-0.5 sm:w-1 bg-amber-500 rounded-full animate-eq-2 h-3" />
      <span className="w-0.5 sm:w-1 bg-[#124032] rounded-full animate-eq-3 h-1.5" />
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
