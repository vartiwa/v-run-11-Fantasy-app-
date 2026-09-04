"use client";

import { Oswald } from "next/font/google";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

export default function BidBattleBar({
  highestBidder = "No Bids Yet",
  currentBid = 200,
  basePrice = 200,
  myTeamName = "",
  wasOutbid = false,
  onDismissOutbid,
  optOutCount = 0,
  isOptedOut = false,
  onJumpBackIn,
}) {
  const hasBids = highestBidder && highestBidder !== "No Bids Yet";
  const isMyTeamLeading = hasBids && highestBidder === myTeamName;
  const teamLeadName = hasBids ? highestBidder.split(" - ")[0] : "Awaiting Opening Nomination";
  const managerName = hasBids && highestBidder.includes(" - ") ? highestBidder.split(" - ")[1] : null;

  const bidIncrease = Math.max(0, currentBid - basePrice);
  const bidMultiplier = basePrice > 0 ? (currentBid / basePrice).toFixed(1) : "1.0";

  // Progress relative to base price (caps at 100% when 3x base)
  const progressPercent = Math.min(100, Math.max(12, (currentBid / (basePrice * 3)) * 100));

  return (
    <div
      className={`w-full rounded-3xl p-3.5 select-none transition-all duration-300 relative overflow-hidden border-2 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_28px_rgba(0,0,0,0.04)] ${
        wasOutbid
          ? "bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-rose-500 ring-4 ring-rose-500/20 animate-pulse"
          : isOptedOut
          ? "bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 ring-1 ring-amber-400/20"
          : isMyTeamLeading
          ? "bg-gradient-to-r from-[#eef7f2] via-[#e4f2ea] to-[#eef7f2] border-[#7fc49c] ring-2 ring-[#124032]/25 shadow-[0_0_20px_rgba(18,64,50,0.08)]"
          : "bg-gradient-to-r from-white via-[#fcfbf7] to-[#f7f5ee] border-[#dcd6c8]"
      }`}
    >
      {/* Dynamic State Alert Ribbon if Outbid */}
      {wasOutbid && (
        <div className="flex items-center justify-between bg-rose-600 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-xl mb-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="animate-bounce">⚡</span>
            <span>YOU WERE OUTBID! {teamLeadName} holds current high bid at {formatLakhsAndCrores(currentBid, true)}</span>
          </div>
          {onDismissOutbid && (
            <button
              onClick={onDismissOutbid}
              className="text-white/80 hover:text-white text-xs cursor-pointer font-bold ml-2"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Dynamic State Alert Ribbon if Opted Out */}
      {isOptedOut && !wasOutbid && (
        <div className="flex items-center justify-between bg-gradient-to-r from-[#854d0e] to-[#713f12] text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl mb-2 shadow-xs border border-amber-600/40">
          <div className="flex items-center gap-2">
            <span>✋</span>
            <span>YOU HAVE BACKED OFF — Your paddle is parked for this lot</span>
          </div>
          {onJumpBackIn && (
            <button
              onClick={onJumpBackIn}
              className="px-2.5 py-0.5 bg-white hover:bg-amber-50 text-amber-900 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-2xs active:translate-y-0.5 transition-all"
            >
              ⚡ Jump Back In!
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Leader Franchise & Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-xs border transition-all duration-300 shrink-0 ${
              isMyTeamLeading
                ? "bg-gradient-to-b from-[#185341] to-[#0e3328] text-white border-[#185341] shadow-[0_0_16px_rgba(18,64,50,0.3)] scale-105"
                : hasBids
                ? "bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border-[#d4be8c]"
                : "bg-[#f4f1e8] text-[#8c8577] border-[#ded8cb]"
            }`}
          >
            {isMyTeamLeading ? "👑" : hasBids ? "🏏" : "⏳"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#767c84]">
                Current High Paddle
              </span>
              {isMyTeamLeading ? (
                <span className="text-[9px] font-mono bg-[#124032] text-white px-2 py-0.5 rounded-md font-black tracking-wider uppercase shadow-2xs">
                  ★ YOUR FRANCHISE LEADS
                </span>
              ) : hasBids ? (
                <span className="text-[9px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-bold">
                  ACTIVE LEADER
                </span>
              ) : null}

              {optOutCount > 0 && (
                <span className="text-[9px] font-mono bg-[#ece7db] text-[#5c4308] border border-[#d8d1c0] px-1.5 py-0.2 rounded font-bold">
                  ✋ {optOutCount} Backed Off
                </span>
              )}
            </div>

            <p className={`text-base font-bold uppercase tracking-wide truncate ${isMyTeamLeading ? "text-[#124032]" : "text-[#121417]"}`}>
              {teamLeadName}
              {managerName && (
                <span className="text-xs font-mono font-normal text-[#767c84] ml-1.5 lowercase">
                  ({managerName})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Bid Growth Meter & Leading Amount */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#e8e2d4]">
          <div className="text-left sm:text-right">
            <span className="text-[9px] text-[#767c84] uppercase font-mono font-bold tracking-wider block">
              Bid Surge
            </span>
            <span className={`text-xs font-mono font-bold ${bidIncrease > 0 ? "text-amber-800" : "text-[#767c84]"}`}>
              {bidIncrease > 0 ? `+${formatLakhsAndCrores(bidIncrease, true)} (${bidMultiplier}x Base)` : "At Opening Base"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-[#d8d1c0] hidden sm:block"></div>

          <div className="text-right">
            <span className="text-[9px] text-[#767c84] uppercase font-mono font-bold tracking-wider block">
              Leading High Bid
            </span>
            <span className={`text-2xl font-bold tracking-tight text-[#121417] ${oswald.className}`}>
              {formatLakhsAndCrores(currentBid, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Escalation Progress Bar with Milestone Markers */}
      <div className="relative w-full bg-[#e8e2d4] h-2.5 rounded-full mt-2.5 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${
            isMyTeamLeading
              ? "bg-gradient-to-r from-[#185341] via-[#248166] to-[#124032]"
              : hasBids
              ? "bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600"
              : "bg-slate-300"
          }`}
          style={{
            width: `${progressPercent}%`,
          }}
        >
          {/* Shimmer on progress */}
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
