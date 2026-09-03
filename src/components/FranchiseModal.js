"use client";

import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

export default function FranchiseModal({ franchise, onClose }) {
  if (!franchise) return null;

  const { name, budget = 10000, squad = {} } = franchise;
  const playerList = Array.isArray(squad) ? squad : Object.values(squad || {});

  const totalSpent = playerList.reduce((acc, p) => acc + (p.boughtFor || 0), 0);
  const overseasCount = playerList.filter((p) => p.isOverseas).length;

  const roleCounts = {
    Batsman: playerList.filter((p) => p.role === "Batsman").length,
    Bowler: playerList.filter((p) => p.role === "Bowler").length,
    "Wicket Keeper": playerList.filter((p) => p.role === "Wicket Keeper").length,
    "All-Rounder": playerList.filter((p) => p.role === "All-Rounder").length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e0e0e] border border-white/15 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#141414] p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[#EF4123] text-[10px] uppercase font-black tracking-widest block">
              Franchise Squad Inspector
            </span>
            <h3 className={`text-2xl md:text-3xl font-black text-white uppercase tracking-tight ${oswald.className}`}>
              {name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-4 bg-[#111] p-4 border-b border-white/5 text-center divide-x divide-white/5">
          <div>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest block">Available</span>
            <span className={`text-xl font-black text-[#EF4123] ${oswald.className}`}>₹{budget}L</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest block">Spent</span>
            <span className={`text-xl font-black text-slate-200 ${oswald.className}`}>₹{totalSpent}L</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest block">Squad</span>
            <span className={`text-xl font-black text-white ${oswald.className}`}>{playerList.length}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[9px] uppercase font-bold tracking-widest block">Overseas</span>
            <span className={`text-xl font-black ${overseasCount > 4 ? "text-red-400" : "text-amber-400"} ${oswald.className}`}>
              {overseasCount}
            </span>
          </div>
        </div>

        {/* Role Breakdown Badges */}
        <div className="flex flex-wrap gap-2 px-6 py-3 bg-[#0a0a0a] border-b border-white/5 text-[10px] font-bold uppercase tracking-wider">
          <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
            🏏 Batsmen: {roleCounts.Batsman}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            🎯 Bowlers: {roleCounts.Bowler}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
            🧤 WK: {roleCounts["Wicket Keeper"]}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
            ⚡ All-Rounder: {roleCounts["All-Rounder"]}
          </span>
        </div>

        {/* Squad List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {playerList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">🏏</span>
              <p className="text-xs uppercase tracking-widest font-bold">No players acquired yet</p>
            </div>
          ) : (
            playerList.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#141414] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#202020] border border-white/10 flex items-center justify-center font-black text-xs text-white">
                    {player.name
                      ? player.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "P"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white text-sm">{player.name}</p>
                      {player.isOverseas && (
                        <span className="text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-black">
                          ✈️ OS
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                      {player.role}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">
                    Bought For
                  </span>
                  <span className={`text-lg font-black text-[#EF4123] ${oswald.className}`}>
                    ₹{player.boughtFor || player.basePrice}L
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
