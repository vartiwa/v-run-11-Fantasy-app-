"use client";

import { Oswald } from "next/font/google";

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
        <div className="relative flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform duration-200 group-hover:scale-105 ${
              isCaptain
                ? "bg-[#FDE8D3] text-[#657166] border-2 border-[#F3C3B2]"
                : isViceCaptain
                ? "bg-[#DAEBE3] text-[#657166] border-2 border-[#99CDD8]"
                : "bg-white text-[#657166] border border-slate-200"
            }`}
          >
            <span>{player.flag || "🏏"}</span>

            {isCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#F3C3B2] text-[#657166] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                C
              </span>
            )}
            {isViceCaptain && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#99CDD8] text-[#657166] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                VC
              </span>
            )}
          </div>

          <div className="mt-1 bg-white/90 px-2 py-0.5 rounded-lg border border-slate-200 text-center max-w-[90px] truncate shadow-sm">
            <p className="text-[10px] font-bold text-[#657166] truncate leading-tight">{player.name}</p>
            <p className="text-[8px] text-slate-500 font-bold">₹{player.boughtFor}L</p>
          </div>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute top-14 hidden group-hover:flex flex-col gap-1 bg-white border border-slate-200 p-2 rounded-2xl shadow-xl z-40 whitespace-nowrap">
          <button
            onClick={() => onSetCaptain(player.id)}
            className={`text-[10px] font-bold px-2 py-1 rounded-xl text-left ${
              isCaptain ? "bg-[#F3C3B2] text-[#657166]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            👑 Set Captain (2x Pts)
          </button>
          <button
            onClick={() => onSetViceCaptain(player.id)}
            className={`text-[10px] font-bold px-2 py-1 rounded-xl text-left ${
              isViceCaptain ? "bg-[#99CDD8] text-[#657166]" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🛡️ Set Vice-Captain (1.5x)
          </button>
          <button
            onClick={() => onBenchPlayer(player)}
            className="text-[10px] font-bold px-2 py-1 rounded-xl text-left text-red-500 hover:bg-red-50"
          >
            🪑 Move to Bench
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Composition Info Bar */}
      <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm text-center">
        <div>
          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">Runs</span>
          <span className={`text-lg font-bold text-[#657166] ${oswald.className}`}>{totalRuns}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">Wickets</span>
          <span className={`text-lg font-bold text-[#657166] ${oswald.className}`}>{totalWickets}</span>
        </div>
        <div>
          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">Overseas</span>
          <span className={`text-lg font-bold ${overseasCount > 4 ? "text-[#F3C3B2]" : "text-[#657166]"} ${oswald.className}`}>
            {overseasCount}/4
          </span>
        </div>
        <div>
          <span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider block">Capacity</span>
          <span className={`text-lg font-bold text-[#657166] ${oswald.className}`}>{playingXI.length}/11</span>
        </div>
      </div>

      {/* 2D Field Surface */}
      <div className="relative w-full min-h-[580px] bg-gradient-to-b from-[#CFD6C4]/40 via-[#DAEBE3]/50 to-[#CFD6C4]/40 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between overflow-hidden shadow-sm">
        {/* WICKET KEEPERS */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#657166] border border-slate-200 mb-1">
            🧤 Wicket-Keepers
          </span>
          <div className="flex justify-center flex-wrap min-h-[50px]">
            {wicketKeepers.length > 0 ? wicketKeepers.map(renderPlayerNode) : <span className="text-[10px] text-slate-400 italic">+ Add WK</span>}
          </div>
        </div>

        {/* BATTERS */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#657166] border border-slate-200 mb-1">
            🏏 Batters
          </span>
          <div className="flex justify-center flex-wrap min-h-[50px]">
            {batsmen.length > 0 ? batsmen.map(renderPlayerNode) : <span className="text-[10px] text-slate-400 italic">+ Add Batters</span>}
          </div>
        </div>

        {/* ALL-ROUNDERS */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#657166] border border-slate-200 mb-1">
            ⚡ All-Rounders
          </span>
          <div className="flex justify-center flex-wrap min-h-[50px]">
            {allRounders.length > 0 ? allRounders.map(renderPlayerNode) : <span className="text-[10px] text-slate-400 italic">+ Add All-Rounders</span>}
          </div>
        </div>

        {/* BOWLERS */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#657166] border border-slate-200 mb-1">
            🎯 Bowlers
          </span>
          <div className="flex justify-center flex-wrap min-h-[50px]">
            {bowlers.length > 0 ? bowlers.map(renderPlayerNode) : <span className="text-[10px] text-slate-400 italic">+ Add Bowlers</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
