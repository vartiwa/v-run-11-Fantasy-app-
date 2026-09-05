"use client";

import { useState } from "react";
import { Outfit } from "next/font/google";
import { formatLakhsAndCrores, getDynamicBidIncrements, calculatePurseReserve } from "@/lib/formatCurrency";
import {
  GavelIcon,
  CrownIcon,
  ClockIcon,
  CheckIcon,
  DiceIcon,
  DoorExitIcon,
  HandStopIcon,
  BoltIcon,
  ResetIcon,
  NextTrackIcon,
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
  status,
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
  isAuctioneerBusy = false,
  onToggleAuctioneerBusy,
  onPassGavel,
  onTogglePlayerHammer,
  onLeaveRoom,
}) {
  const isLocked = status === "sold" || status === "unsold";
  const isWinning = highestBidder && highestBidder === myTeamName;
  const hasBids = highestBidder && highestBidder !== "No Bids Yet";
  const canUseHammer = isHost || isNeutralAuctioneer || allowPlayerHammer || isAuctioneerBusy;

  const [hoveredInc, setHoveredInc] = useState(null);
  const [isStriking, setIsStriking] = useState(false);

  // Dynamic Bidding Increments based on player tier (50L, 1Cr, 2Cr) and escalating current bid
  const increments = getDynamicBidIncrements(basePrice, currentBid);

  // Budget reserve calculations
  const { reserveNeeded, isCritical } = calculatePurseReserve(myBudget, squadCount);

  const handlePaddlePress = (amount) => {
    sounds.playClick();
    onBid(amount);
  };

  const handleHammerClick = () => {
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 350);
    onSell();
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] border border-[#c6ded0] rounded-3xl p-4 flex flex-col justify-between select-none shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] ring-1 ring-[#059669]/10 text-[#12241b]">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Tactile Corner Rivets */}
      <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#e2ece5] border border-[#c2dcce] pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#e2ece5] border border-[#c2dcce] pointer-events-none" />

      <div>
        {/* Header */}
        <div className="pb-3 border-b border-[#cfe0d5]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold uppercase tracking-wider text-[#0f5132] ${outfit.className}`}>
                  {isNeutralAuctioneer ? "Auctioneer Gavel Console" : "Tactile Bidding Paddle"}
                </h4>
                {isHost && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#fef3c7] text-[#854d0e] border border-[#f59e0b]/40 px-2.5 py-0.5 rounded-lg font-bold uppercase shadow-xs">
                    <CrownIcon className="w-3 h-3 text-[#854d0e]" />
                    <span>Host Authority</span>
                  </span>
                )}
                {isAuctioneerBusy && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-bold uppercase shadow-xs animate-pulse">
                    <ClockIcon className="w-3 h-3" />
                    <span>Busy (Hammer Open)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5c7567] mt-0.5">
                {isNeutralAuctioneer ? (
                  <span className="text-amber-800 font-bold">You dictate the room, lots & gavel strikes</span>
                ) : isWinning ? (
                  <span className="text-[#047857] font-bold inline-flex items-center gap-1">
                    <CheckIcon className="w-3.5 h-3.5 text-[#047857]" />
                    <span>You hold the highest bid! Awaiting counter-bids or gavel.</span>
                  </span>
                ) : isOptedOut ? (
                  <span className="text-amber-800 font-bold">You backed off — Tap 'Jump Back In' anytime to resume bidding</span>
                ) : (
                  <span>Tap a paddle increment to raise bid instantly</span>
                )}
              </p>
            </div>

            {!isNeutralAuctioneer ? (
              <div className="text-right bg-[#eef5f1] border border-[#cbe0d3] px-3 py-1 rounded-xl shadow-inner">
                <span className="text-[9px] uppercase font-bold text-[#5c7567] block leading-none">
                  YOUR PURSE
                </span>
                <span className={`text-base font-bold text-[#047857] leading-none mt-0.5 block drop-shadow-xs font-mono ${outfit.className}`}>
                  {formatLakhsAndCrores(myBudget, true)}
                </span>
                {isCritical && (
                  <span className="text-[8px] text-rose-600 font-bold block font-mono">
                    Reserve: {formatLakhsAndCrores(reserveNeeded, true)}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-right bg-[#fef3c7] border border-[#f59e0b]/40 px-3 py-1 rounded-xl shadow-xs">
                <span className="text-[9px] uppercase text-[#854d0e] block font-bold leading-none">
                  AUTHORITY
                </span>
                <span className="text-xs font-bold text-[#854d0e] leading-none mt-0.5 block">
                  Gavel Master
                </span>
              </div>
            )}
          </div>

          {/* 🌟 Auctioneer Authority & Busy / Leaving Strip */}
          {(isHost || isNeutralAuctioneer) && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#cfe0d5] text-[11px] flex-wrap">
              {onToggleAuctioneerBusy && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleAuctioneerBusy();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs border ${
                    isAuctioneerBusy
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-500 animate-pulse"
                      : "bg-white hover:bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                  title={
                    isAuctioneerBusy
                      ? "You are marked busy. Tap to reclaim gavel authority"
                      : "Step away temporarily. Hands hammer authority to the room until you return."
                  }
                >
                  {isAuctioneerBusy ? (
                    <>
                      <CheckIcon className="w-3 h-3" />
                      <span>I'm Back (Reclaim)</span>
                    </>
                  ) : (
                    <>
                      <ClockIcon className="w-3 h-3" />
                      <span>Step Away / Busy</span>
                    </>
                  )}
                </button>
              )}

              {onPassGavel && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onPassGavel();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#eaf4ee] text-[#0e3524] border border-[#badbc6] font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  title="Pass gavel authority to another manager in the room"
                >
                  <DiceIcon className="w-3.5 h-3.5 text-[#0f5132]" />
                  <span>Pass Gavel</span>
                </button>
              )}

              {onTogglePlayerHammer && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onTogglePlayerHammer();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    allowPlayerHammer
                      ? "bg-[#e6f7ee] text-[#047857] border-[#a7f3d0]"
                      : "bg-white text-[#5c7567] border-[#cfe2d6] hover:text-[#0e2c1e]"
                  }`}
                  title="Allow non-host players to strike the hammer"
                >
                  <GavelIcon className="w-3 h-3 text-current" />
                  <span>Player Hammer: {allowPlayerHammer ? "ON" : "OFF"}</span>
                </button>
              )}

              {onLeaveRoom && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    if (confirm("Pass gavel authority to next manager and exit the draft?")) {
                      onLeaveRoom();
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition-all cursor-pointer shadow-xs ml-auto flex items-center gap-1.5"
                  title="Pass gavel to another manager and leave room"
                >
                  <DoorExitIcon className="w-3.5 h-3.5 text-rose-700" />
                  <span>Leave / Exit</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic 3D Physical Quick Bid Buttons (For Bidders & Playing Hosts) */}
        {!isNeutralAuctioneer && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-bold text-[#5c7567] tracking-wider">
                RAISE PADDLE ({basePrice >= 200 ? "MARQUEE 2 CR" : basePrice >= 100 ? "SENIOR 1 CR" : "50 LAKHS"})
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#047857] font-bold font-mono">
                  Current: {formatLakhsAndCrores(currentBid, true)}
                </span>

                {/* Bidder Opt-Out "Back Off" / "No Call" Toggle */}
                {!isOptedOut && !isWinning && !isLocked && onOptOut && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOptOut(true);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-[#5c7567] hover:text-rose-700 bg-white hover:bg-rose-50 border border-[#cbe0d3] hover:border-rose-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                    title="Opt out / Pass on this lot"
                  >
                    <HandStopIcon className="w-3 h-3 text-rose-600" />
                    <span>Back Off</span>
                  </button>
                )}
              </div>
            </div>

            {/* If opted out, show the Jump Back In banner */}
            {isOptedOut ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-amber-50 border border-amber-300 flex items-center justify-between gap-3 shadow-inner">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <HandStopIcon className="w-4 h-4 text-amber-800" />
                    <span>YOU BACKED OFF (PADDLE PARKED)</span>
                  </div>
                  <p className="text-[10px] text-[#5c7567] mt-0.5">
                    Your paddle is parked for this lot. Change your mind? Re-enter anytime!
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOptOut(false);
                  }}
                  disabled={isLocked}
                  className="px-3.5 py-2 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-[#34d399]/60 border-b-[3px] border-b-[#064e3b] shadow-xs active:translate-y-0.5 active:border-b-[1px] cursor-pointer shrink-0 disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <BoltIcon className="w-3.5 h-3.5" />
                  <span>Jump Back In</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
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
                      className={`group relative p-2.5 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        disabled
                          ? "bg-[#f0f5f2] text-[#9bb0a2] border border-[#d4e2d8] opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-b from-white via-[#f4f8f5] to-[#e4eee7] hover:from-white hover:to-[#ebf4ee] text-[#0e2c1e] border border-[#badbc6] hover:border-[#34d399] border-b-[4px] border-b-[#93be9f] active:translate-y-1 active:border-b-[1px] shadow-[0_4px_12px_rgba(18,64,50,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]"
                      }`}
                      title={
                        isWinning
                          ? "You already hold the highest bid"
                          : !canAfford
                          ? `Insufficient funds (Requires ${formatLakhsAndCrores(nextTotal, true)})`
                          : inc.subtitle
                      }
                    >
                      <span className={`text-sm font-black leading-none text-[#0f3d2a] group-hover:text-[#047857] group-hover:scale-110 transition-transform drop-shadow-xs font-mono ${outfit.className}`}>
                        {inc.label}
                      </span>
                      <span className="text-[9px] text-[#5c7567] mt-1 font-bold group-hover:text-[#0e2c1e] font-mono">
                        {formatLakhsAndCrores(nextTotal, true)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Hover preview information strip */}
            {hoveredInc && !isWinning && !isOptedOut && (
              <div className="mt-2 text-[10px] bg-[#eef5f1] text-[#0e2c1e] px-3 py-1.5 rounded-xl border border-[#cbe0d3] flex items-center justify-between shadow-inner">
                <span>Paddle {hoveredInc.label}: New bid will be <strong className="text-[#047857] font-mono">{formatLakhsAndCrores(currentBid + hoveredInc.amount, false)}</strong></span>
                <span>Purse after: <strong className="text-[#047857] font-mono">{formatLakhsAndCrores(Math.max(0, myBudget - (currentBid + hoveredInc.amount)), true)}</strong></span>
              </div>
            )}

            {/* Prominent Bidder Opt-Out Action Bar */}
            {!isOptedOut && (
              <div className="mt-2.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOptOut(true);
                  }}
                  disabled={isLocked || isWinning || !onOptOut}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-xs cursor-pointer ${
                    isWinning
                      ? "bg-[#f4f8f5] text-[#9bb0a2] border-[#d4e2d8] cursor-not-allowed opacity-60"
                      : isLocked
                      ? "bg-[#f4f8f5] text-[#9bb0a2] border-[#d4e2d8] cursor-not-allowed opacity-50"
                      : "bg-gradient-to-b from-rose-50 to-rose-100 hover:from-rose-100 text-rose-800 border border-rose-200 border-b-[3px] border-b-rose-300 active:translate-y-0.5 active:border-b-[1px]"
                  }`}
                  title={
                    isWinning
                      ? "You currently hold the highest bid and cannot back off on your own bid"
                      : "Fold paddle and opt out of bidding on this player (Can jump back in anytime!)"
                  }
                >
                  <HandStopIcon className="w-4 h-4 text-rose-700" />
                  <span>
                    {isWinning
                      ? "Holding Highest Bid (Cannot Back Off)"
                      : "Back Off / No Call (Fold This Lot)"}
                  </span>
                  {!isWinning && !isLocked && (
                    <span className="text-[10px] text-rose-600 font-normal hidden sm:inline">
                      — Can jump back in anytime!
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🌟 3D GAVEL STRIKE CONSOLE */}
      <div className="pt-3 mt-3 border-t border-[#cfe0d5] flex flex-col gap-2">
        {canUseHammer ? (
          <div className="space-y-2">
            {/* Cast-Iron & Turned Wood Gavel Strike Action */}
            <button
              onClick={handleHammerClick}
              disabled={isLocked}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer ${outfit.className} ${
                isLocked
                  ? "bg-[#f4f8f5] text-[#9bb0a2] cursor-not-allowed border border-[#d4e2d8]"
                  : hasBids
                  ? "bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white border border-[#34d399]/60 border-b-[5px] border-b-[#064e3b] shadow-[0_8px_24px_rgba(5,150,105,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-1 active:border-b-[1px]"
                  : "bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#92400e] hover:from-[#f59e0b] hover:to-[#b45309] text-white border border-amber-400/60 border-b-[5px] border-b-[#78350f] shadow-[0_8px_24px_rgba(217,119,6,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-1 active:border-b-[1px]"
              }`}
            >
              <GavelIcon className="w-5 h-5" isStriking={isStriking} />
              <span className="drop-shadow-xs">
                {status === "sold"
                  ? "Player Sold (Gavel Struck)"
                  : status === "unsold"
                  ? "Player Passed (Unsold)"
                  : hasBids
                  ? `Hammer Down (Award to ${getFranchiseName(highestBidder)} at ${formatLakhsAndCrores(currentBid, true)})`
                  : "Pass (Mark Unsold)"}
              </span>
            </button>

            {/* Precision Tactile Clock & Lot Controls */}
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-xs font-semibold">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExtendTimer();
                }}
                disabled={isLocked}
                className="py-2.5 px-2 bg-gradient-to-b from-white via-[#f5f9f6] to-[#e4eee7] hover:from-white hover:to-[#ebf4ee] text-[#0e3524] rounded-xl border border-[#badbc6] border-b-[3px] border-b-[#93be9f] transition-all disabled:opacity-40 cursor-pointer text-center truncate font-bold shadow-xs active:translate-y-0.5 active:border-b-[1px] inline-flex items-center justify-center gap-1.5"
                title="Add 15s Fair Warning"
              >
                <ClockIcon className="w-3.5 h-3.5 text-[#047857]" />
                <span>+15s Clock</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onResetTimer();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-white via-[#f5f9f6] to-[#e4eee7] hover:from-white hover:to-[#ebf4ee] text-[#0e3524] rounded-xl border border-[#badbc6] border-b-[3px] border-b-[#93be9f] transition-all cursor-pointer text-center truncate font-bold shadow-xs active:translate-y-0.5 active:border-b-[1px] inline-flex items-center justify-center gap-1.5"
                title="Reset 60s Clock"
              >
                <ResetIcon className="w-3.5 h-3.5 text-[#047857]" />
                <span>Reset Clock</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNextLot();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] text-white rounded-xl border border-[#34d399]/60 border-b-[3px] border-b-[#064e3b] transition-all cursor-pointer text-center truncate font-black shadow-xs active:translate-y-0.5 active:border-b-[1px] inline-flex items-center justify-center gap-1.5"
                title="Nominate Next Lot from Catalog"
              >
                <NextTrackIcon className="w-3.5 h-3.5 text-white" />
                <span>Next Lot</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-[#eef5f1] border border-[#cbe0d3] text-center text-xs text-[#284938] shadow-inner font-medium">
            {status === "sold" ? (
              <span className="text-[#047857] font-black">Player Sold by Auction Gavel</span>
            ) : status === "unsold" ? (
              <span className="text-rose-700 font-black">Player Passed Unsold</span>
            ) : isWinning ? (
              <span className="text-[#047857] font-black">You currently hold the winning bid!</span>
            ) : hasBids ? (
              <span className="text-[#0e2c1e] font-bold">Highest Bid: <strong className="font-mono">{formatLakhsAndCrores(currentBid, false)}</strong> • Gavel held by Room Authority</span>
            ) : (
              <span className="text-[#5c7567]">Gavel held by Room Authority (Passes if host leaves or allows)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}