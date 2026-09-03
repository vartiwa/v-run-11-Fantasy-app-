"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

export default function FanPollWidget() {
  const [votes, setVotes] = useState({ csk: 48, mi: 34, rcb: 18 });
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const total = votes.csk + votes.mi + votes.rcb;
  const cskPercent = Math.round((votes.csk / total) * 100);
  const miPercent = Math.round((votes.mi / total) * 100);
  const rcbPercent = Math.round((votes.rcb / total) * 100);

  const handleVote = (key) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    setSelectedOption(key);
    setHasVoted(true);
  };

  return (
    <div className="bg-gradient-to-br from-[#101422] to-[#0a0c14] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping"></span>
          <span className="text-[10px] text-[#A3E635] font-black uppercase tracking-widest">
            Live Fan Poll & Prediction
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-bold uppercase">{total} Votes</span>
      </div>

      <h4 className={`text-xl font-black text-white uppercase tracking-tight mb-4 ${oswald.className}`}>
        Which franchise will assemble the strongest Playing XI?
      </h4>

      <div className="space-y-2.5">
        {/* Option 1 */}
        <button
          onClick={() => handleVote("csk")}
          className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
            selectedOption === "csk"
              ? "border-[#A3E635] bg-[#A3E635]/15"
              : "border-white/10 bg-[#141828] hover:border-white/20"
          }`}
        >
          {hasVoted && (
            <div
              className="absolute inset-y-0 left-0 bg-[#A3E635]/20 transition-all duration-700"
              style={{ width: `${cskPercent}%` }}
            ></div>
          )}
          <div className="flex justify-between items-center relative z-10">
            <span className="font-bold text-xs text-white flex items-center gap-2">
              🦁 Chennai Super Kings
            </span>
            <span className="font-black text-xs text-[#A3E635]">
              {hasVoted ? `${cskPercent}%` : "Vote"}
            </span>
          </div>
        </button>

        {/* Option 2 */}
        <button
          onClick={() => handleVote("mi")}
          className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
            selectedOption === "mi"
              ? "border-[#A3E635] bg-[#A3E635]/15"
              : "border-white/10 bg-[#141828] hover:border-white/20"
          }`}
        >
          {hasVoted && (
            <div
              className="absolute inset-y-0 left-0 bg-blue-500/20 transition-all duration-700"
              style={{ width: `${miPercent}%` }}
            ></div>
          )}
          <div className="flex justify-between items-center relative z-10">
            <span className="font-bold text-xs text-white flex items-center gap-2">
              🏏 Mumbai Titans
            </span>
            <span className="font-black text-xs text-blue-400">
              {hasVoted ? `${miPercent}%` : "Vote"}
            </span>
          </div>
        </button>

        {/* Option 3 */}
        <button
          onClick={() => handleVote("rcb")}
          className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden ${
            selectedOption === "rcb"
              ? "border-[#A3E635] bg-[#A3E635]/15"
              : "border-white/10 bg-[#141828] hover:border-white/20"
          }`}
        >
          {hasVoted && (
            <div
              className="absolute inset-y-0 left-0 bg-red-500/20 transition-all duration-700"
              style={{ width: `${rcbPercent}%` }}
            ></div>
          )}
          <div className="flex justify-between items-center relative z-10">
            <span className="font-bold text-xs text-white flex items-center gap-2">
              👑 Royal Bengaluru
            </span>
            <span className="font-black text-xs text-red-400">
              {hasVoted ? `${rcbPercent}%` : "Vote"}
            </span>
          </div>
        </button>
      </div>

      <p className="text-[10px] text-slate-500 mt-3 italic text-center">
        {hasVoted ? "✓ Your prediction has been registered!" : "Tap a franchise to cast your vote"}
      </p>
    </div>
  );
}
