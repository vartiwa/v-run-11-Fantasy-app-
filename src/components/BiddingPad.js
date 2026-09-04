"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";
import { formatLakhsAndCrores, getDynamicBidIncrements, calculatePurseReserve } from "@/lib/formatCurrency";
import { GavelIcon } from "./AuctionIcons";
import { sounds } from "@/lib/soundEffects";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

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
    <div className="relative w-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl p-4 flex flex-col justify-between select-none shadow-[0_2px_4px_rgba(0,0,0,0.02),0_10px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#121417]">
      <div>
        {/* Header */}
        <div className="pb-3 border-b border-[#e8e2d4]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold uppercase tracking-wider text-[#121417] ${oswald.className}`}>
                  {isNeutralAuctioneer ? "Auctioneer Gavel Console" : "Tactile Bidding Paddle"}
                </h4>
                {isHost && (
                  <span className="text-[10px] bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border border-[#d4be8c] px-2.5 py-0.5 rounded-lg font-mono font-black uppercase flex items-center gap-1 shadow-2xs">
                    <span>👑</span>
                    <span>Host Authority</span>
                  </span>
                )}
                {isAuctioneerBusy && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-mono font-black uppercase shadow-2xs animate-pulse">
                    ⏳ Busy (Hammer Open)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#555a60] mt-0.5 font-mono">
                {isNeutralAuctioneer ? (
                  <span className="text-amber-900 font-bold">You dictate the room, lots & gavel strikes</span>
                ) : isWinning ? (
                  <span className="text-[#124032] font-bold flex items-center gap-1">
                    <span>✓</span>
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
              <div className="text-right bg-[#f5f2e9] border border-[#dfd9cb] px-3 py-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="text-[9px] uppercase font-mono text-[#767c84] block font-bold leading-none">
                  YOUR PURSE
                </span>
                <span className="text-base font-bold font-mono text-[#124032] leading-none mt-0.5 block">
                  {formatLakhsAndCrores(myBudget, true)}
                </span>
                {isCritical && (
                  <span className="text-[8px] font-mono text-rose-700 font-bold block">
                    Reserve: {formatLakhsAndCrores(reserveNeeded, true)}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-right bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] border border-[#d4be8c] px-3 py-1 rounded-xl shadow-2xs">
                <span className="text-[9px] uppercase font-mono text-[#5c4308] block font-black leading-none">
                  AUTHORITY
                </span>
                <span className="text-xs font-black font-mono text-[#5c4308] leading-none mt-0.5 block">
                  Gavel Master
                </span>
              </div>
            )}
          </div>

          {/* 🌟 Auctioneer Authority & Busy / Leaving Strip */}
          {(isHost || isNeutralAuctioneer) && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-[#f0ece1] font-mono text-[10px] flex-wrap">
              {onToggleAuctioneerBusy && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleAuctioneerBusy();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs border ${
                    isAuctioneerBusy
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-700 animate-pulse"
                      : "bg-gradient-to-b from-white to-[#fff8ed] hover:bg-amber-50 text-amber-900 border-amber-300"
                  }`}
                  title={
                    isAuctioneerBusy
                      ? "You are marked busy. Tap to reclaim gavel authority"
                      : "Step away temporarily. Hands hammer authority to the room until you return."
                  }
                >
                  <span>{isAuctioneerBusy ? "✅ I'm Back (Reclaim)" : "⏳ Step Away / Busy"}</span>
                </button>
              )}

              {onPassGavel && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onPassGavel();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#faf8f4] text-[#5c4308] border border-[#d8d1c0] font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                  title="Pass gavel authority to another manager in the room"
                >
                  <span>🎲 Pass Gavel</span>
                </button>
              )}

              {onTogglePlayerHammer && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onTogglePlayerHammer();
                  }}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer border ${
                    allowPlayerHammer
                      ? "bg-emerald-100 text-[#124032] border-emerald-300"
                      : "bg-white text-[#767c84] border-[#d8d1c0] hover:text-[#121417]"
                  }`}
                  title="Allow non-host players to strike the hammer"
                >
                  🔨 Player Hammer: {allowPlayerHammer ? "ON" : "OFF"}
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
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold transition-all cursor-pointer shadow-2xs ml-auto flex items-center gap-1"
                  title="Pass gavel to another manager and leave room"
                >
                  <span>🚪 Leave / Exit</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Dynamic 3D Physical Quick Bid Buttons (For Bidders & Playing Hosts) */}
        {!isNeutralAuctioneer && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase font-mono font-bold text-[#767c84] tracking-wider">
                RAISE PADDLE ({basePrice >= 200 ? "MARQUEE 2 CR" : basePrice >= 100 ? "SENIOR 1 CR" : "50 LAKHS"})
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#124032] font-bold">
                  Current: {formatLakhsAndCrores(currentBid, true)}
                </span>

                {/* ✋ Bidder Opt-Out "Back Off" / "No Call" Toggle */}
                {!isOptedOut && !isWinning && !isLocked && onOptOut && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOptOut(true);
                    }}
                    className="text-[10px] font-mono font-bold text-[#767c84] hover:text-rose-700 bg-white hover:bg-rose-50 border border-[#d8d1c0] hover:border-rose-300 px-2 py-0.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Opt out / Pass on this lot"
                  >
                    ✋ Back Off / No Call
                  </button>
                )}
              </div>
            </div>

            {/* If opted out, show the Jump Back In banner */}
            {isOptedOut ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/80 border border-amber-300/80 flex items-center justify-between gap-3 shadow-inner">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900">
                    <span>✋</span>
                    <span>YOU BACKED OFF (NO CALL)</span>
                  </div>
                  <p className="text-[10px] text-[#767c84] font-mono mt-0.5">
                    Your paddle is parked for this lot. Change your mind? Re-enter anytime!
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOptOut(false);
                  }}
                  disabled={isLocked}
                  className="px-3.5 py-2 bg-gradient-to-b from-[#185341] to-[#0e3328] hover:to-[#09241c] text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border border-[#1b5e4a] shadow-xs active:translate-y-0.5 cursor-pointer shrink-0 disabled:opacity-40"
                >
                  ⚡ Jump Back In!
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
                          ? "bg-[#ece8df] text-slate-400 border border-[#dcd6c8] opacity-50 cursor-not-allowed"
                          : "bg-gradient-to-b from-white via-[#faf9f5] to-[#f0ece1] hover:to-[#e8e2d4] text-[#121417] border border-[#d8d1c0] border-b-[3px] border-b-[#b8af9c] active:translate-y-0.5 active:border-b-[1px] shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-md"
                      }`}
                      title={
                        isWinning
                          ? "You already hold the highest bid"
                          : !canAfford
                          ? `Insufficient funds (Requires ${formatLakhsAndCrores(nextTotal, true)})`
                          : inc.subtitle
                      }
                    >
                      <span className="text-sm font-bold font-mono leading-none text-[#124032] group-hover:scale-105 transition-transform">
                        {inc.label}
                      </span>
                      <span className="text-[9px] text-[#767c84] mt-1 font-mono font-semibold">
                        {formatLakhsAndCrores(nextTotal, true)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Hover preview information strip */}
            {hoveredInc && !isWinning && !isOptedOut && (
              <div className="mt-2 text-[10px] font-mono bg-[#f4f1e8] text-[#555a60] px-2.5 py-1 rounded-lg border border-[#dfd9cb] flex items-center justify-between">
                <span>Paddle {hoveredInc.label}: New bid will be <strong>{formatLakhsAndCrores(currentBid + hoveredInc.amount, false)}</strong></span>
                <span>Purse after: <strong>{formatLakhsAndCrores(Math.max(0, myBudget - (currentBid + hoveredInc.amount)), true)}</strong></span>
              </div>
            )}

            {/* ✋ Prominent Bidder Opt-Out ("Back Off / No Call") Action Bar */}
            {!isOptedOut && (
              <div className="mt-2.5">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOptOut(true);
                  }}
                  disabled={isLocked || isWinning || !onOptOut}
                  className={`w-full py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-2xs cursor-pointer ${
                    isWinning
                      ? "bg-[#f5f2e9] text-[#8c8577] border-[#dcd6c8] cursor-not-allowed opacity-75"
                      : isLocked
                      ? "bg-[#ece8df] text-[#8c8577] border-[#dcd6c8] cursor-not-allowed opacity-50"
                      : "bg-gradient-to-b from-[#fffaf7] to-[#fdede7] hover:from-[#fdede7] hover:to-[#fbdad0] text-rose-800 border-rose-200 border-b-2 border-b-rose-300 hover:border-rose-400 active:translate-y-0.5 active:border-b"
                  }`}
                  title={
                    isWinning
                      ? "You currently hold the highest bid and cannot back off on your own bid"
                      : "Fold paddle and opt out of bidding on this player (Can jump back in anytime!)"
                  }
                >
                  <span className="text-sm">✋</span>
                  <span>
                    {isWinning
                      ? "Holding Highest Bid (Cannot Back Off)"
                      : "Back Off / No Call (Fold This Lot)"}
                  </span>
                  {!isWinning && !isLocked && (
                    <span className="text-[10px] text-rose-600/80 font-normal hidden sm:inline">
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
      <div className="pt-3 mt-3 border-t border-[#e8e2d4] flex flex-col gap-2">
        {canUseHammer ? (
          <div className="space-y-2">
            {/* Cast-Iron & Turned Wood Gavel Strike Action */}
            <button
              onClick={handleHammerClick}
              disabled={isLocked}
              className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isLocked
                  ? "bg-[#e5e0d3] text-[#8c8577] cursor-not-allowed border border-[#d0c9b8]"
                  : hasBids
                  ? "bg-gradient-to-b from-[#185341] to-[#0e3328] hover:from-[#1b5e4a] hover:to-[#103a2e] text-white border border-[#1b5e4a] border-b-4 border-b-[#071c15] shadow-[0_6px_16px_rgba(18,64,50,0.3)] active:translate-y-1 active:border-b-0"
                  : "bg-gradient-to-b from-[#92400e] to-[#712b06] hover:from-[#a14b10] hover:to-[#833309] text-white border border-[#a14b10] border-b-4 border-b-[#451802] shadow-[0_6px_16px_rgba(146,64,14,0.3)] active:translate-y-1 active:border-b-0"
              }`}
            >
              <GavelIcon className="w-5 h-5" isStriking={isStriking} />
              <span className="drop-shadow-2xs">
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
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[11px] font-mono">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExtendTimer();
                }}
                disabled={isLocked}
                className="py-2.5 px-2 bg-gradient-to-b from-white to-[#f4f1e8] hover:to-[#ece6d8] text-[#121417] rounded-xl border border-[#d8d1c0] border-b-2 border-b-[#b8af9c] transition-all disabled:opacity-40 cursor-pointer text-center truncate font-bold shadow-2xs active:translate-y-0.5 active:border-b"
                title="Add 15s Fair Warning"
              >
                ⏱️ +15s Clock
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onResetTimer();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-white to-[#f4f1e8] hover:to-[#ece6d8] text-[#121417] rounded-xl border border-[#d8d1c0] border-b-2 border-b-[#b8af9c] transition-all cursor-pointer text-center truncate font-bold shadow-2xs active:translate-y-0.5 active:border-b"
                title="Reset 60s Clock"
              >
                🔄 Reset Clock
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNextLot();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-[#eef7f2] to-[#d8ede1] hover:to-[#c8e5d3] text-[#124032] border border-[#b2ddc4] border-b-2 border-b-[#8ec7a5] rounded-xl transition-all cursor-pointer text-center truncate font-black shadow-2xs active:translate-y-0.5 active:border-b"
                title="Nominate Next Lot from Catalog"
              >
                ⏭️ Next Lot
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#faf8f2] to-[#f0ece1] border border-[#dcd6c8] text-center text-xs font-mono text-[#555a60] shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]">
            {status === "sold" ? (
              <span className="text-[#124032] font-black">Player Sold by Auction Gavel</span>
            ) : status === "unsold" ? (
              <span className="text-rose-700 font-black">Player Passed Unsold</span>
            ) : isWinning ? (
              <span className="text-[#124032] font-black">You currently hold the winning bid!</span>
            ) : hasBids ? (
              <span className="text-[#121417] font-bold">Highest Bid: {formatLakhsAndCrores(currentBid, false)} • Gavel held by Room Authority</span>
            ) : (
              <span className="text-[#8c8577]">Gavel held by Room Authority (Passes if host leaves or allows)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}