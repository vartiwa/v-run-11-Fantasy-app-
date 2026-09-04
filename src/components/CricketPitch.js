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
                ? "bg-[#FDE8D3] text-[#657166] border-2 border-[#F3C3B2] shadow-[0_0_12px_rgba(243,195,178,0.5)]"
                : isViceCaptain
                ? "bg-[#DAEBE3] text-[#657166] border-2 border-[#99CDD8] shadow-[0_0_12px_rgba(153,205,216,0.5)]"
                : "bg-white text-[#657166] border border-slate-200"
            }`}
          >
            <span>{player.flag || "🏏"}</span>

            {isCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F3C3B2] text-[#657166] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                C
              </span>
            )}
            {isViceCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#99CDD8] text-[#657166] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                VC
              </span>
            )}
          </div>

          <div className="mt-1 bg-white/95 px-2.5 py-0.5 rounded-lg border border-slate-200 text-center max-w-[100px] truncate shadow-xs">
            <p className="text-[10px] font-bold text-[#121417] truncate leading-tight">{player.name}</p>
            <p className="text-[8px] text-[#124032] font-mono font-bold">
              {formatLakhsAndCrores(player.boughtFor, true)}
            </p>
          </div>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute top-14 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 p-2 rounded-2xl shadow-xl z-40 whitespace-nowrap">
          <button
            onClick={() => {
              sounds.playClick();
              onSetCaptain(player.id);
            }}
            className={`text-[10px] font-bold px-2 py-1 rounded-xl text-left cursor-pointer transition-colors ${
              isCaptain ? "bg-[#F3C3B2] text-[#657166]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            👑 Set Captain (2x Pts)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onSetViceCaptain(player.id);
            }}
            className={`text-[10px] font-bold px-2 py-1 rounded-xl text-left cursor-pointer transition-colors ${
              isViceCaptain ? "bg-[#99CDD8] text-[#657166]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🛡️ Set Vice-Captain (1.5x)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onBenchPlayer(player);
            }}
            className="text-[10px] font-bold px-2 py-1 rounded-xl text-left text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
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
      <div className="grid grid-cols-4 gap-3 bg-white p-3.5 rounded-3xl border border-[#dcd6c8] shadow-xs text-center shrink-0">
        <div>
          <span className="text-[#767c84] text-[9px] uppercase font-mono font-bold tracking-wider block">Total Runs</span>
          <span className={`text-lg font-bold text-[#121417] ${oswald.className}`}>{totalRuns}</span>
        </div>
        <div>
          <span className="text-[#767c84] text-[9px] uppercase font-mono font-bold tracking-wider block">Wickets</span>
          <span className={`text-lg font-bold text-[#121417] ${oswald.className}`}>{totalWickets}</span>
        </div>
        <div>
          <span className="text-[#767c84] text-[9px] uppercase font-mono font-bold tracking-wider block">Overseas</span>
          <span className={`text-lg font-bold ${overseasCount > 4 ? "text-rose-600" : "text-[#124032]"} ${oswald.className}`}>
            {overseasCount}/4
          </span>
        </div>
        <div>
          <span className="text-[#767c84] text-[9px] uppercase font-mono font-bold tracking-wider block">Playing XI</span>
          <span className={`text-lg font-bold text-[#121417] ${oswald.className}`}>{playingXI.length}/11</span>
        </div>
      </div>

      {/* 2D Field Surface with Authentic Cricket Pitch SVG Overlay */}
      <div className="relative flex-1 w-full bg-gradient-to-b from-[#d9e5db] via-[#e5eee8] to-[#d9e5db] rounded-3xl border border-[#c5d5ca] p-4 flex flex-col justify-between overflow-hidden shadow-inner min-h-[420px]">
        {/* Authentic SVG Cricket Ground & Crease Markings */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 400 600"
        >
          {/* 30-Yard Circle boundary */}
          <ellipse cx="200" cy="300" rx="175" ry="240" fill="none" stroke="#9bb6a3" strokeWidth="1.5" strokeDasharray="6 6" />
          
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
          <span className="inline-block px-3 py-0.5 bg-white/90 backdrop-blur-xs rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-[#121417] border border-black/10 shadow-2xs mb-1">
            🧤 Wicket-Keepers ({wicketKeepers.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {wicketKeepers.length > 0 ? wicketKeepers.map(renderPlayerNode) : <span className="text-[10px] text-slate-500 font-mono italic my-auto">+ Add Wicket-Keeper</span>}
          </div>
        </div>

        {/* BATTERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-white/90 backdrop-blur-xs rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-[#121417] border border-black/10 shadow-2xs mb-1">
            🏏 Specialist Batters ({batsmen.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {batsmen.length > 0 ? batsmen.map(renderPlayerNode) : <span className="text-[10px] text-slate-500 font-mono italic my-auto">+ Add Batters</span>}
          </div>
        </div>

        {/* ALL-ROUNDERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-white/90 backdrop-blur-xs rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-[#121417] border border-black/10 shadow-2xs mb-1">
            ⚡ All-Rounders ({allRounders.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {allRounders.length > 0 ? allRounders.map(renderPlayerNode) : <span className="text-[10px] text-slate-500 font-mono italic my-auto">+ Add All-Rounders</span>}
          </div>
        </div>

        {/* BOWLERS */}
        <div className="text-center relative z-10">
          <span className="inline-block px-3 py-0.5 bg-white/90 backdrop-blur-xs rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-[#121417] border border-black/10 shadow-2xs mb-1">
            🎯 Strike Bowlers ({bowlers.length})
          </span>
          <div className="flex justify-center flex-wrap min-h-[44px]">
            {bowlers.length > 0 ? bowlers.map(renderPlayerNode) : <span className="text-[10px] text-slate-500 font-mono italic my-auto">+ Add Bowlers</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
