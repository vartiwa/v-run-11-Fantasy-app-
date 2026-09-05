"use client";

import { useState } from "react";
import { Outfit } from "next/font/google";
import { formatLakhsAndCrores, getDynamicBidIncrements, calculatePurseReserve } from "@/lib/formatCurrency";
import {
  GavelIcon,
  CrownIcon,
  ClockIcon,
  CheckIcon,
  HandStopIcon,
  BoltIcon,
  ResetIcon,
  NextTrackIcon,
  TrophyIcon,
} from "./AuctionIcons";
import { sounds } from "@/lib/soundEffects";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700", "800", "900"] });

const getFranchiseName = (id = "") => id.split(" - ")[0];

export default function BiddingPad({
  onBid,
  onSell,
  onNextLot,
  onExtendTimer,
  onResetTimer,
  status = "available",
  currentBid = 0,
  basePrice = 50,
  myBudget = 10000,
  squadCount = 0,
  highestBidder = "",
  myTeamName = "",
  isHost = false,
  isNeutralAuctioneer = false,
  allowPlayerHammer = false,
  isOptedOut = false,
  onOptOut,
  // Chronometer & battle props
  secondsLeft = 60,
  totalDuration = 60,
  isWarning = false,
  isTimeUp = false,
  wasOutbid = false,
  onDismissOutbid,
  optOutCount = 0,
  recentLogs = [],
}) {
  const isLocked = status === "sold" || status === "unsold";
  const isWinning = highestBidder && highestBidder === myTeamName;
  const hasBids = highestBidder && highestBidder !== "No Bids Yet";
  const canUseHammer = isHost || isNeutralAuctioneer || allowPlayerHammer;

  const [hoveredInc, setHoveredInc] = useState(null);
  const [isStriking, setIsStriking] = useState(false);

  // Dynamic Bidding Increments based on player tier and escalating bid
  const increments = getDynamicBidIncrements(basePrice, currentBid);
  const defaultNextAmount = increments[0]?.amount || 10;
  const defaultNextTotal = currentBid + defaultNextAmount;

  // Budget reserve calculations
  const { reserveNeeded, isCritical } = calculatePurseReserve(myBudget, squadCount);

  // Chronometer progress calculation
  const currentSecs = secondsLeft ?? totalDuration;
  const progressPercent = totalDuration > 0 ? Math.max(0, Math.min(100, (currentSecs / totalDuration) * 100)) : 0;
  const timerRadius = 20;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerDashoffset = timerCircumference - (progressPercent / 100) * timerCircumference;

  const handlePaddlePress = (amount) => {
    sounds.playClick();
    onBid(amount);
  };

  const handleHammerClick = () => {
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 350);
    onSell();
  };

  const leaderFranchise = hasBids ? getFranchiseName(highestBidder) : "Awaiting Opening Paddle";
  const bidSurge = Math.max(0, currentBid - basePrice);

  return (
    <div className="relative w-full h-full bg-white/95 backdrop-blur-xl border border-[#cfe0d5] rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_12px_32px_rgba(18,64,50,0.06),0_2px_8px_rgba(18,64,50,0.03)] text-[#12241b] overflow-hidden">
      {/* Top Foil Sheen Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* 🌟 1. INTEGRATED BATTLE HUD & CHRONOMETER STRIP */}
      <div className="pb-3.5 border-b border-[#e4eee6]">
        {/* Outbid Alert Ribbon */}
        {wasOutbid && (
          <div className="flex items-center justify-between bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl mb-2.5 shadow-xs animate-pulse">
            <div className="flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-white" />
              <span>You were outbid by {leaderFranchise}! Current bid: {formatLakhsAndCrores(currentBid, true)}</span>
            </div>
            {onDismissOutbid && (
              <button
                onClick={onDismissOutbid}
                className="text-white/80 hover:text-white cursor-pointer px-1 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Top Metric Header */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Leader Franchise Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5c7567]">
                Auction Leader
              </span>
              {isWinning ? (
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0] px-2 py-0.5 rounded-md font-bold uppercase shadow-2xs">
                  <CrownIcon className="w-2.5 h-2.5 text-[#047857]" />
                  <span>YOU LEAD</span>
                </span>
              ) : hasBids ? (
                <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-300/80 px-2 py-0.5 rounded-md font-bold uppercase">
                  HIGH PADDLE
                </span>
              ) : null}

              {optOutCount > 0 && (
                <span className="text-[10px] bg-[#f0f6f2] text-[#5c7567] border border-[#cbe0d3] px-2 py-0.5 rounded-md font-medium">
                  {optOutCount} Backed Off
                </span>
              )}
            </div>

            <p className={`text-lg font-extrabold uppercase tracking-tight truncate mt-0.5 ${isWinning ? "text-[#047857]" : "text-[#0e2c1e]"} ${outfit.className}`}>
              {leaderFranchise}
            </p>

            {bidSurge > 0 && (
              <p className="text-[11px] text-[#854d0e] font-semibold mt-0.5">
                Surge: +{formatLakhsAndCrores(bidSurge, true)}
              </p>
            )}
          </div>

          {/* Right: Integrated Compact Chronometer Ring */}
          <div className="flex items-center gap-2.5 shrink-0 bg-[#f7faf8] border border-[#d6e6dc] px-3 py-1.5 rounded-2xl shadow-2xs">
            <div className="relative flex items-center justify-center w-11 h-11">
              <svg width="48" height="48" className="-rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r={timerRadius}
                  stroke="#d6e6dc"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r={timerRadius}
                  stroke={isTimeUp ? "#ef4444" : isWarning ? "#f59e0b" : "#059669"}
                  strokeWidth="3.5"
                  strokeDasharray={timerCircumference}
                  strokeDashoffset={timerDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300"
                />
              </svg>
              <span className={`absolute text-xs font-black font-mono leading-none ${
                isTimeUp ? "text-rose-600 animate-ping" : isWarning ? "text-amber-700" : "text-[#0e2c1e]"
              }`}>
                {currentSecs}s
              </span>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                isTimeUp ? "text-rose-600" : isWarning ? "text-amber-700" : "text-[#047857]"
              }`}>
                {isTimeUp ? "Final Call" : isWarning ? "Fair Warning" : "Clock Active"}
              </span>
              <span className="text-[9px] text-[#5c7567] font-medium block">
                60s Round
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. PRIMARY BIDDING ACTION & QUICK INCREMENTS */}
      {!isNeutralAuctioneer ? (
        <div className="my-auto py-2 flex flex-col gap-3">
          {/* If user is opted out: show clean re-entry bar */}
          {isOptedOut ? (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <HandStopIcon className="w-4 h-4 text-amber-800" />
                  <span>YOUR PADDLE IS PARKED</span>
                </div>
                <p className="text-[11px] text-[#5c7567] mt-0.5">
                  You backed off this lot. Ready to re-enter?
                </p>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onOptOut(false);
                }}
                disabled={isLocked}
                className="px-4 py-2 bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10b981] hover:to-[#059669] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:translate-y-0.5 cursor-pointer shrink-0 disabled:opacity-40 flex items-center gap-1.5"
              >
                <BoltIcon className="w-3.5 h-3.5 text-white" />
                <span>Jump Back In</span>
              </button>
            </div>
          ) : (
            <>
              {/* THE HERO RAISE PADDLE (Primary One-Tap Interaction) */}
              <button
                onClick={() => handlePaddlePress(defaultNextAmount)}
                disabled={isLocked || isWinning || defaultNextTotal > myBudget}
                className={`w-full py-4 px-5 rounded-2xl font-black transition-all flex items-center justify-between cursor-pointer shadow-md active:translate-y-0.5 ${outfit.className} ${
                  isWinning
                    ? "bg-gradient-to-b from-[#e8f6ee] to-[#d3ede0] text-[#065f46] border-2 border-[#34d399] cursor-default shadow-xs"
                    : isLocked
                    ? "bg-[#f0f6f2] text-[#8ea696] border border-[#cbe0d3] cursor-not-allowed opacity-60"
                    : defaultNextTotal > myBudget
                    ? "bg-[#fdf2f2] text-rose-800 border border-rose-200 cursor-not-allowed opacity-60"
                    : "bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white border border-[#34d399]/40 shadow-[0_8px_24px_rgba(5,150,105,0.25)] active:scale-[0.99]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isWinning ? "bg-white text-[#047857] shadow-xs" : "bg-white/20 text-white"
                  }`}>
                    {isWinning ? (
                      <CheckIcon className="w-5 h-5 text-[#047857]" />
                    ) : (
                      <BoltIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <span className="text-sm font-extrabold uppercase tracking-wide block leading-none">
                      {isWinning
                        ? "YOU HOLD HIGH BID"
                        : isLocked
                        ? "LOT FINALIZED"
                        : defaultNextTotal > myBudget
                        ? "INSUFFICIENT PURSE"
                        : "RAISE BID TO"}
                    </span>
                    <span className="text-[11px] font-sans font-medium opacity-85 block mt-0.5">
                      {isWinning
                        ? "Awaiting rival counter-bids or gavel"
                        : defaultNextTotal > myBudget
                        ? `Requires ${formatLakhsAndCrores(defaultNextTotal, true)}`
                        : `Next minimum increment: +${formatLakhsAndCrores(defaultNextAmount, true)}`}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black font-mono tracking-tight block">
                    {isWinning
                      ? formatLakhsAndCrores(currentBid, false)
                      : formatLakhsAndCrores(defaultNextTotal, false)}
                  </span>
                </div>
              </button>

              {/* Quick Increment Chips Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c7567]">
                    Custom Jump Amounts
                  </span>
                  {hoveredInc && (
                    <span className="text-[10px] text-[#047857] font-semibold">
                      New Total: <strong className="font-mono">{formatLakhsAndCrores(currentBid + hoveredInc.amount, false)}</strong>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {increments.map((inc) => {
                    const nextTotal = currentBid + inc.amount;
                    const canAfford = nextTotal <= myBudget;
                    const disabled = isLocked || !canAfford || isWinning;

                    return (
                      <button
                        key={inc.amount}
                        onClick={() => handlePaddlePress(inc.amount)}
                        onMouseEnter={() => setHoveredInc(inc)}
                        onMouseLeave={() => setHoveredInc(null)}
                        disabled={disabled}
                        className={`py-2 px-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border shadow-2xs ${
                          disabled
                            ? "bg-[#f0f6f2] text-[#9bb0a2] border-[#d6e6dc] opacity-40 cursor-not-allowed"
                            : "bg-white hover:bg-[#f0f9f4] text-[#0e2c1e] hover:border-[#34d399] border-[#cbe0d3] hover:shadow-xs active:translate-y-0.5"
                        }`}
                      >
                        <span className={`text-xs font-black font-mono leading-none ${outfit.className}`}>
                          {inc.label}
                        </span>
                        <span className="text-[9px] text-[#5c7567] font-semibold mt-1 font-mono">
                          {formatLakhsAndCrores(nextTotal, true)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Back Off / Fold Toggle */}
              {!isWinning && !isLocked && onOptOut && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#5c7567]">Not interested in this player?</span>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOptOut(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    <HandStopIcon className="w-3 h-3 text-rose-700" />
                    <span>Back Off Lot</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        /* Neutral Auctioneer Notice */
        <div className="my-auto p-4 rounded-2xl bg-[#eef5f1] border border-[#cbe0d3] text-center">
          <p className="text-sm font-bold text-[#0e2c1e]">Neutral Room Auctioneer</p>
          <p className="text-xs text-[#5c7567] mt-1">You control gavel authority, nominations, and clock</p>
        </div>
      )}

      {/* 🌟 3. HOST GAVEL & TIME CONTROLS */}
      <div className="pt-3 border-t border-[#e4eee6] flex flex-col gap-2">
        {canUseHammer ? (
          <div className="space-y-2">
            {/* The Gavel Strike Button */}
            <button
              onClick={handleHammerClick}
              disabled={isLocked}
              className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:translate-y-0.5 ${outfit.className} ${
                isLocked
                  ? "bg-[#f0f6f2] text-[#9bb0a2] border border-[#d6e6dc] cursor-not-allowed opacity-60"
                  : hasBids
                  ? "bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white border border-[#34d399]/40 shadow-[0_6px_20px_rgba(5,150,105,0.25)]"
                  : "bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-400 shadow-[0_6px_20px_rgba(217,119,6,0.25)]"
              }`}
            >
              <GavelIcon className="w-4 h-4" isStriking={isStriking} />
              <span>
                {status === "sold"
                  ? "Player Sold"
                  : status === "unsold"
                  ? "Player Passed"
                  : hasBids
                  ? `Hammer Down • Award to ${leaderFranchise} (${formatLakhsAndCrores(currentBid, true)})`
                  : "Pass Unsold"}
              </span>
            </button>

            {/* Utility Clock & Next Controls */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExtendTimer();
                }}
                disabled={isLocked}
                className="py-1.5 px-2 bg-white hover:bg-[#f0f9f4] text-[#0e2c1e] rounded-xl border border-[#cbe0d3] hover:border-[#34d399] text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                title="Add 15s to Clock"
              >
                <ClockIcon className="w-3.5 h-3.5 text-[#047857]" />
                <span>+15s</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onResetTimer();
                }}
                className="py-1.5 px-2 bg-white hover:bg-[#f0f9f4] text-[#0e2c1e] rounded-xl border border-[#cbe0d3] hover:border-[#34d399] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                title="Reset 60s Timer"
              >
                <ResetIcon className="w-3.5 h-3.5 text-[#047857]" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNextLot();
                }}
                className="py-1.5 px-2 bg-gradient-to-b from-[#059669] to-[#047857] hover:from-[#10b981] hover:to-[#059669] text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                title="Advance to next catalog lot"
              >
                <span>Next Lot</span>
                <NextTrackIcon className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-2.5 px-3 rounded-xl bg-[#f0f6f2] border border-[#cbe0d3] text-center text-xs text-[#284938] font-medium">
            {status === "sold" ? (
              <span className="text-[#047857] font-bold">Sold by Gavel</span>
            ) : status === "unsold" ? (
              <span className="text-rose-700 font-bold">Passed Unsold</span>
            ) : isWinning ? (
              <span className="text-[#047857] font-bold">You currently hold the winning paddle</span>
            ) : (
              <span>Gavel held by Room Authority</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}