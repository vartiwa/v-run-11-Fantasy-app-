"use client";

export default function AudioVisualizer({ isMuted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={isMuted ? "Unmute Broadcast Audio" : "Mute Broadcast Audio"}
      className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
        isMuted
          ? "bg-[#12141c] border-white/10 text-slate-500 hover:text-slate-300"
          : "bg-gradient-to-r from-red-950/60 to-[#18101a] border-[#EF4123]/40 text-[#EF4123] shadow-[0_0_15px_rgba(239,65,35,0.25)]"
      }`}
    >
      <span className="text-sm">{isMuted ? "🔇" : "🔊"}</span>

      {/* Animated Equalizer Wave Bars */}
      {!isMuted ? (
        <div className="flex items-end gap-0.5 h-3.5 w-4">
          <span className="w-1 bg-[#EF4123] rounded-full animate-eq-1"></span>
          <span className="w-1 bg-[#FF6B00] rounded-full animate-eq-2"></span>
          <span className="w-1 bg-amber-400 rounded-full animate-eq-3"></span>
          <span className="w-1 bg-[#EF4123] rounded-full animate-eq-4"></span>
        </div>
      ) : (
        <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
          MUTED
        </span>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes eq1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        @keyframes eq2 { 0%, 100% { height: 14px; } 50% { height: 6px; } }
        @keyframes eq3 { 0%, 100% { height: 8px; } 50% { height: 14px; } }
        @keyframes eq4 { 0%, 100% { height: 12px; } 50% { height: 4px; } }
        .animate-eq-1 { animation: eq1 0.7s ease-in-out infinite; }
        .animate-eq-2 { animation: eq2 0.5s ease-in-out infinite; }
        .animate-eq-3 { animation: eq3 0.8s ease-in-out infinite; }
        .animate-eq-4 { animation: eq4 0.6s ease-in-out infinite; }
      `,
        }}
      />
    </button>
  );
}
