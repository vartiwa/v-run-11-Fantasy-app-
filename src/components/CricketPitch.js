"use client";

import { Oswald } from "next/font/google";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";
import { sounds } from "@/lib/soundEffects";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

export default function CricketPitch({
  playingXI = [],
  captainId,
  viceCaptainId,
  onSetCaptain,
  onSetViceCaptain,
  onBenchPlayer,
}) {
  const wicketKeepers = playingXI.filter((p) => p.role === "Wicket Keeper");
  const batsmen = playingXI.filter((p) => p.role === "Batsman");
  const allRounders = playingXI.filter((p) => p.role === "All-Rounder");
  const bowlers = playingXI.filter((p) => p.role === "Bowler");

  const totalRuns = playingXI.reduce((acc, p) => acc + (p.stats?.runs || 0), 0);
  const totalWickets = playingXI.reduce((acc, p) => acc + (p.stats?.wickets || 0), 0);
  const overseasCount = playingXI.filter((p) => p.isOverseas).length;

  const renderPlayerNode = (player) => {
    const isCaptain = captainId === player.id;
    const isViceCaptain = viceCaptainId === player.id;

    return (
      <div key={player.id} className="relative flex flex-col items-center group cursor-pointer m-2">
        <div className="relative flex flex-col items-center transition-transform duration-200 group-hover:scale-105">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs transition-all ${
              isCaptain
                ? "bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border-2 border-[#d4be8c] shadow-[0_0_16px_rgba(212,190,140,0.6)]"
                : isViceCaptain
                ? "bg-gradient-to-b from-[#f0f4f8] to-[#d9e2ec] text-[#102a43] border-2 border-[#9fb3c8] shadow-[0_0_16px_rgba(159,179,200,0.6)]"
                : "bg-white/95 text-[#121417] border border-[#d8d1c0] shadow-2xs"
            }`}
          >
            <span>{player.flag || "🏏"}</span>

            {isCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#d4be8c] text-[#423006] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                C
              </span>
            )}
            {isViceCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#9fb3c8] text-[#102a43] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                VC
              </span>
            )}
          </div>

          <div className="mt-1 bg-[#040c08]/90 px-2.5 py-0.5 rounded-lg border border-white/10 text-center max-w-[105px] truncate shadow-xs">
            <p className="text-[10px] font-bold text-white truncate leading-tight">{player.name}</p>
            <p className="text-[8px] text-[#34d399] font-mono font-bold">
              {formatLakhsAndCrores(player.boughtFor, true)}
            </p>
          </div>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute top-14 hidden group-hover:flex flex-col gap-1 bg-[#06140e] border border-[#d4be8c]/30 p-2 rounded-2xl shadow-xl z-40 whitespace-nowrap text-white">
          <button
            onClick={() => {
              sounds.playClick();
              onSetCaptain(player.id);
            }}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-xl text-left cursor-pointer transition-colors ${
              isCaptain ? "bg-[#d4be8c]/20 text-[#ecdcb8]" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            👑 Set Captain (2x Pts)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSetViceCaptain(player.id);
            }}
            className={`text-[10px] font-bold px-2.5 py-1 rounded-xl text-left cursor-pointer transition-colors ${
              isViceCaptain ? "bg-sky-950/50 text-sky-300" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            🛡️ Set Vice-Captain (1.5x)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onBenchPlayer(player);
            }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-xl text-left text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
          >
            🪑 Move to Bench
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Top Composition Info Bar */}
      <div className="grid grid-cols-4 gap-3 bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] p-3.5 rounded-3xl border border-[#d4be8c]/25 shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,190,140,0.15)] text-center shrink-0">
        <div>
          <span className="text-white/50 text-[9px] uppercase font-mono font-bold tracking-wider block">Total Runs</span>
          <span className={`text-lg font-bold text-[#ecdcb8] ${oswald.className}`}>{totalRuns}</span>
        </div>
        <div>
          <span className="text-white/50 text-[9px] uppercase font-mono font-bold tracking-wider block">Wickets</span>
          <span className={`text-lg font-bold text-[#ecdcb8] ${oswald.className}`}>{totalWickets}</span>
        </div>
        <div>
          <span className="text-white/50 text-[9px] uppercase font-mono font-bold tracking-wider block">Overseas</span>
          <span className={`text-lg font-bold ${overseasCount > 4 ? "text-rose-400" : "text-[#34d399]"} ${oswald.className}`}>
            {overseasCount}/4
          </span>
        </div>
        <div>
          <span className="text-white/50 text-[9px] uppercase font-mono font-bold tracking-wider block">Playing XI</span>
          <span className={`text-lg font-bold text-[#ecdcb8] ${oswald.className}`}>{playingXI.length}/11</span>
        </div>
      </div>

      {/* 2D Field Surface with Authentic Cricket Pitch SVG Overlay */}
      <div className="relative flex-1 w-full bg-gradient-to-b from-[#184e38] via-[#1f5c43] to-[#184e38] rounded-3xl border-2 border-[#133e2d] p-4 flex flex-col justify-between overflow-hidden shadow-inner min-h-[420px]">
        {/* Authentic SVG Cricket Ground & Crease Markings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
          preserveAspectRatio="none"
          viewBox="0 0 400 600"
        >
          {/* 30-Yard Circle boundary */}
          <ellipse cx="200" cy="300" rx="175" ry="240" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.6" />
          
          {/* Central 22-Yard Turf Pitch Rectangle */}
          <rect x="165" y="150" width="70" height="300" rx="4" fill="#eedcc0" stroke="#d5be9b" strokeWidth="1.5" />
          
          {/* Bowling Crease & Stumps North (Keeper/Batting end) */}
          <line x1="170" y1="180" x2="230" y2="180" stroke="#fff" strokeWidth="2" />
          <line x1="180" y1="175" x2="220" y2="175" stroke="#b45309" strokeWidth="2" />
          {/* Popping Crease North */}
          <line x1="165" y1="195" x2="235" y2="195" stroke="#fff" strokeWidth="2" />
          
          {/* Bowling Crease & Stumps South (Bowler end) */}
          <line x1="170" y1="420" x2="230" y2="420" stroke="#fff" strokeWidth="2" />
          <line x1="180" y1="425" x2="220" y2="425" stroke="#b45309" strokeWidth="2" />
          {/* Popping Crease South */}
          <line x1="165" y1="405" x2="235" y2="405" stroke="#fff" strokeWidth="2" />
        </svg>

        {/* WICKET KEEPERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs mb-1">
            🧤 Wicket-Keepers ({wicketKeepers.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {wicketKeepers.length > 0 ? wicketKeepers.map(renderPlayerNode) : <span className="text-[10px] text-emerald-200/80 font-mono italic my-auto">+ Add Wicket-Keeper</span>}
          </div>
        </div>

        {/* BATTERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs mb-1">
            🏏 Specialist Batters ({batsmen.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {batsmen.length > 0 ? batsmen.map(renderPlayerNode) : <span className="text-[10px] text-emerald-200/80 font-mono italic my-auto">+ Add Batters</span>}
          </div>
        </div>

        {/* ALL-ROUNDERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs mb-1">
            ⚡ All-Rounders ({allRounders.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {allRounders.length > 0 ? allRounders.map(renderPlayerNode) : <span className="text-[10px] text-emerald-200/80 font-mono italic my-auto">+ Add All-Rounders</span>}
          </div>
        </div>

        {/* BOWLERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-black/40 backdrop-blur-md rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white border border-white/20 shadow-xs mb-1">
            🎯 Strike Bowlers ({bowlers.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {bowlers.length > 0 ? bowlers.map(renderPlayerNode) : <span className="text-[10px] text-emerald-200/80 font-mono italic my-auto">+ Add Bowlers</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
