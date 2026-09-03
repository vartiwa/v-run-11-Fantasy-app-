"use client";

import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

export default function BidBattleBar({
  highestBidder = "No Bids Yet",
  currentBid = 200,
  basePrice = 200,
  myTeamName = "",
}) {
  const hasBids = highestBidder && highestBidder !== "No Bids Yet";
  const isMyTeamLeading = hasBids && highestBidder === myTeamName;
  const teamLeadName = hasBids ? highestBidder.split(" - ")[0] : "Awaiting Bids";

  const bidIncrease = currentBid - basePrice;
  const bidMultiplier = basePrice > 0 ? (currentBid / basePrice).toFixed(1) : 1;

  return (
    <div className="w-full bg-gradient-to-r from-slate-900/90 via-[#131b2e]/90 to-slate-900/90 border border-white/10 rounded-3xl p-3 shadow-xl backdrop-blur-xl relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div
        className={`absolute -right-10 -top-10 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-colors duration-700 ${
          isMyTeamLeading ? "bg-emerald-500/20" : hasBids ? "bg-[#EF4123]/20" : "bg-sky-500/10"
        }`}
      ></div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Leader Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-md border ${
              isMyTeamLeading
                ? "bg-emerald-500 text-white border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : hasBids
                ? "bg-[#EF4123] text-white border-[#FF6B00] shadow-[0_0_15px_rgba(239,65,35,0.4)]"
                : "bg-slate-800 text-slate-400 border-white/10"
            }`}
          >
            {isMyTeamLeading ? "👑" : hasBids ? "⚡" : "⏳"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">
                Current Bid Leader
              </span>
              {isMyTeamLeading && (
                <span className="text-[8px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded font-black">
                  YOUR FRANCHISE
                </span>
              )}
            </div>
            <p className={`text-base font-black uppercase tracking-wide truncate ${isMyTeamLeading ? "text-emerald-400" : "text-white"}`}>
              {teamLeadName}
            </p>
          </div>
        </div>

        {/* Dynamic Bid Growth Meter */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">
              Bid Surge
            </span>
            <span className={`text-sm font-black ${bidIncrease > 0 ? "text-amber-400" : "text-slate-400"}`}>
              {bidIncrease > 0 ? `+₹${bidIncrease}L (${bidMultiplier}x Base)` : "At Base Price"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest block">
              Leading Amount
            </span>
            <span className={`text-xl font-black text-[#EF4123] ${oswald.className}`}>
              ₹{currentBid}L
            </span>
          </div>
        </div>
      </div>

      {/* Surge Progress Bar */}
      <div className="w-full bg-black/40 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isMyTeamLeading
              ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_#10b981]"
              : "bg-gradient-to-r from-[#EF4123] to-[#FF6B00] shadow-[0_0_10px_#ef4123]"
          }`}
          style={{
            width: `${Math.min(100, Math.max(15, (currentBid / (basePrice * 2.5)) * 100))}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
