"use client";

import { Outfit } from "next/font/google";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";
import { TrophyIcon, CricketBatIcon, ClockIcon, BoltIcon, HandStopIcon, CrownIcon } from "./AuctionIcons";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800", "900"] });

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
      className={`w-full rounded-3xl p-3.5 select-none transition-all duration-300 relative overflow-hidden border shadow-[0_16px_36px_rgba(18,64,50,0.06),0_2px_6px_rgba(18,64,50,0.03)] ${
        wasOutbid
          ? "bg-gradient-to-r from-rose-50 via-white to-rose-50 border-2 border-rose-400 ring-4 ring-rose-400/20 text-rose-950 animate-pulse"
          : isOptedOut
          ? "bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300 ring-2 ring-amber-400/20 text-amber-950"
          : isMyTeamLeading
          ? "bg-gradient-to-r from-[#eaf6ef] via-white to-[#eaf6ef] border-2 border-[#10b981] ring-2 ring-[#10b981]/25 shadow-[0_12px_28px_rgba(16,185,129,0.12)] text-[#0e2c1e]"
          : "bg-gradient-to-r from-white via-[#f7faf8] to-[#edf5f0] border border-[#c6ded0] ring-1 ring-[#059669]/10 text-[#12241b]"
      }`}
    >
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Dynamic State Alert Ribbon if Outbid */}
      {wasOutbid && (
        <div className="flex items-center justify-between bg-rose-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl mb-2 border border-rose-500 shadow-xs">
          <div className="flex items-center gap-2">
            <BoltIcon className="w-4 h-4 text-white animate-bounce" />
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
        <div className="flex items-center justify-between bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-1.5 rounded-xl mb-2 shadow-xs border border-amber-300">
          <div className="flex items-center gap-2">
            <HandStopIcon className="w-3.5 h-3.5 text-amber-900" />
            <span>YOU HAVE BACKED OFF — Your paddle is parked for this lot</span>
          </div>
          {onJumpBackIn && (
            <button
              onClick={onJumpBackIn}
              className="px-2.5 py-1 bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10b981] hover:to-[#047857] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-xs active:translate-y-0.5 transition-all inline-flex items-center gap-1"
            >
              <BoltIcon className="w-3 h-3" />
              <span>Jump Back In</span>
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        {/* Leader Franchise & Status */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border transition-all duration-300 shrink-0 ${
              isMyTeamLeading
                ? "bg-gradient-to-b from-[#059669] to-[#047857] text-white border-[#059669] shadow-[0_0_16px_rgba(16,185,129,0.3)] scale-105"
                : hasBids
                ? "bg-gradient-to-b from-[#fef3c7] to-[#fde68a] text-[#854d0e] border-[#f59e0b]/40 shadow-xs"
                : "bg-[#eef5f1] text-[#7d9b89] border border-[#cbe0d3]"
            }`}
          >
            {isMyTeamLeading ? (
              <TrophyIcon className="w-5 h-5 text-white" />
            ) : hasBids ? (
              <CricketBatIcon className="w-5 h-5 text-[#854d0e]" />
            ) : (
              <ClockIcon className="w-5 h-5 text-[#7d9b89]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c7567]">
                Current High Paddle
              </span>
              {isMyTeamLeading ? (
                <span className="inline-flex items-center gap-1 text-[9px] bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0] px-2 py-0.5 rounded-md font-bold tracking-wider uppercase shadow-xs">
                  <CrownIcon className="w-2.5 h-2.5 text-[#047857]" />
                  <span>YOUR FRANCHISE LEADS</span>
                </span>
              ) : hasBids ? (
                <span className="text-[9px] bg-[#fef3c7] text-[#854d0e] border border-[#f59e0b]/40 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  ACTIVE LEADER
                </span>
              ) : null}

              {optOutCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[9px] bg-[#eef5f1] text-[#5c7567] border border-[#cbe0d3] px-2 py-0.5 rounded-md font-semibold">
                  <HandStopIcon className="w-2.5 h-2.5" />
                  <span>{optOutCount} Backed Off</span>
                </span>
              )}
            </div>

            <p className={`text-base font-extrabold uppercase tracking-wide truncate ${isMyTeamLeading ? "text-[#047857]" : "text-[#0e2c1e]"} ${outfit.className}`}>
              {teamLeadName}
              {managerName && (
                <span className="text-xs font-normal text-[#5c7567] ml-1.5 font-sans lowercase">
                  ({managerName})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Dynamic Bid Growth Meter & Leading Amount */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#cfe0d5]">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-[#5c7567] uppercase font-bold tracking-wider block">
              Bid Surge
            </span>
            <span className={`text-xs font-bold ${bidIncrease > 0 ? "text-amber-700" : "text-[#5c7567]"}`}>
              {bidIncrease > 0 ? `+${formatLakhsAndCrores(bidIncrease, true)} (${bidMultiplier}x Base)` : "At Opening Base"}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-[#cfe0d5] hidden sm:block"></div>

          <div className="text-right">
            <span className="text-[10px] text-[#5c7567] uppercase font-bold tracking-wider block">
              Leading High Bid
            </span>
            <span className={`text-2xl font-black tracking-tight text-[#0f3d2a] drop-shadow-xs font-mono ${outfit.className}`}>
              {formatLakhsAndCrores(currentBid, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Escalation Progress Bar with Milestone Markers */}
      <div className="relative w-full bg-[#e2ede5] h-2.5 rounded-full mt-2.5 overflow-hidden border border-[#c2dcce] shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out relative ${
            isMyTeamLeading
              ? "bg-gradient-to-r from-[#059669] via-[#10b981] to-[#059669] shadow-[0_0_12px_#10b981]"
              : hasBids
              ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 shadow-[0_0_10px_#f59e0b]"
              : "bg-[#badbc6]"
          }`}
          style={{
            width: `${progressPercent}%`,
          }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
