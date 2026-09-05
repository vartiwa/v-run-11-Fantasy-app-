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
      className={`w-full rounded-3xl p-3.5 select-none transition-all duration-300 relative overflow-hidden border shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(212,190,140,0.15)] ${
        wasOutbid
          ? "bg-gradient-to-r from-[#1f090d] via-[#140608] to-[#1f090d] border-rose-500 ring-4 ring-rose-500/25 animate-pulse"
          : isOptedOut
          ? "bg-gradient-to-r from-[#1c1204] via-[#120a02] to-[#1c1204] border-amber-500/50 ring-2 ring-amber-500/20"
          : isMyTeamLeading
          ? "bg-gradient-to-r from-[#082218] via-[#0b291d] to-[#082218] border-[#34d399]/60 ring-2 ring-[#34d399]/25 shadow-[0_0_30px_rgba(52,211,153,0.18)]"
          : "bg-gradient-to-r from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border-[#d4be8c]/30"
      }`}
    >
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent pointer-events-none" />

      {/* Dynamic State Alert Ribbon if Outbid */}
      {wasOutbid && (
        <div className="flex items-center justify-between bg-rose-600/90 text-white text-[11px] font-mono font-bold px-3 py-1 rounded-xl mb-2 border border-rose-400/40 shadow-xs">
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
        <div className="flex items-center justify-between bg-gradient-to-r from-[#78350f] to-[#451a03] text-[#ecdcb8] text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl mb-2 shadow-xs border border-amber-500/40">
          <div className="flex items-center gap-2">
            <span>✋</span>
            <span>YOU HAVE BACKED OFF — Your paddle is parked for this lot</span>
          </div>
          {onJumpBackIn && (
            <button
              onClick={onJumpBackIn}
              className="px-2.5 py-0.5 bg-gradient-to-b from-[#34d399] to-[#059669] hover:from-[#10b981] hover:to-[#047857] text-[#040c08] rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-2xs active:translate-y-0.5 transition-all"
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
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-md border transition-all duration-300 shrink-0 ${
              isMyTeamLeading
                ? "bg-gradient-to-b from-[#185341] to-[#0e3328] text-white border-[#34d399] shadow-[0_0_16px_rgba(52,211,153,0.4)] scale-105"
                : hasBids
                ? "bg-gradient-to-b from-[#2b200b] to-[#171105] text-[#ecdcb8] border-[#d4be8c]/60 shadow-[0_0_12px_rgba(212,190,140,0.2)]"
                : "bg-[#040c08] text-white/40 border-white/10"
            }`}
          >
            {isMyTeamLeading ? "👑" : hasBids ? "🏏" : "⏳"}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/50">
                Current High Paddle
              </span>
              {isMyTeamLeading ? (
                <span className="text-[9px] font-mono bg-[#34d399] text-[#040c08] px-2 py-0.5 rounded-md font-black tracking-wider uppercase shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                  ★ YOUR FRANCHISE LEADS
                </span>
              ) : hasBids ? (
                <span className="text-[9px] font-mono bg-[#d4be8c]/20 text-[#ecdcb8] border border-[#d4be8c]/40 px-1.5 py-0.2 rounded font-bold">
                  ACTIVE LEADER
                </span>
              ) : null}

              {optOutCount > 0 && (
                <span className="text-[9px] font-mono bg-white/10 text-white/70 border border-white/10 px-1.5 py-0.2 rounded font-bold">
                  ✋ {optOutCount} Backed Off
                </span>
              )}
            </div>

            <p className={`text-base font-bold uppercase tracking-wide truncate ${isMyTeamLeading ? "text-[#34d399]" : "text-white"}`}>
              {teamLeadName}
              {managerName && (
                <span className="text-xs font-mono font-normal text-white/50 ml-1.5 lowercase">
                  ({managerName})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Bid Growth Meter & Leading Amount */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
          <div className="text-left sm:text-right">
            <span className="text-[9px] text-white/50 uppercase font-mono font-bold tracking-wider block">
              Bid Surge
            </span>
            <span className={`text-xs font-mono font-bold ${bidIncrease > 0 ? "text-amber-400" : "text-white/50"}`}>
              {bidIncrease > 0 ? `+${formatLakhsAndCrores(bidIncrease, true)} (${bidMultiplier}x Base)` : "At Opening Base"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

          <div className="text-right">
            <span className="text-[9px] text-white/50 uppercase font-mono font-bold tracking-wider block">
              Leading High Bid
            </span>
            <span className={`text-2xl font-bold tracking-tight text-[#ecdcb8] drop-shadow-[0_2px_10px_rgba(212,190,140,0.3)] ${oswald.className}`}>
              {formatLakhsAndCrores(currentBid, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Escalation Progress Bar with Milestone Markers */}
      <div className="relative w-full bg-[#040c08] h-2.5 rounded-full mt-2.5 overflow-hidden border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${
            isMyTeamLeading
              ? "bg-gradient-to-r from-[#124032] via-[#34d399] to-[#124032] shadow-[0_0_12px_#34d399]"
              : hasBids
              ? "bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 shadow-[0_0_10px_#f59e0b]"
              : "bg-white/20"
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
