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
    <div className="relative w-full bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-[#d4be8c]/25 rounded-3xl p-4 flex flex-col justify-between select-none shadow-[0_16px_36px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,190,140,0.2)] text-white">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent pointer-events-none" />

      {/* Tactile Corner Rivets */}
      <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-[#d4be8c]/30 border border-[#d4be8c]/50 pointer-events-none" />
      <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#d4be8c]/30 border border-[#d4be8c]/50 pointer-events-none" />

      <div>
        {/* Header */}
        <div className="pb-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className={`text-sm font-bold uppercase tracking-wider text-[#ecdcb8] ${oswald.className}`}>
                  {isNeutralAuctioneer ? "Auctioneer Gavel Console" : "Tactile Bidding Paddle"}
                </h4>
                {isHost && (
                  <span className="text-[10px] bg-[#d4be8c]/15 text-[#ecdcb8] border border-[#d4be8c]/40 px-2.5 py-0.5 rounded-lg font-mono font-black uppercase flex items-center gap-1 shadow-xs">
                    <span>👑</span>
                    <span>Host Authority</span>
                  </span>
                )}
                {isAuctioneerBusy && (
                  <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-lg font-mono font-black uppercase shadow-xs animate-pulse">
                    ⏳ Busy (Hammer Open)
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60 mt-0.5 font-mono">
                {isNeutralAuctioneer ? (
                  <span className="text-amber-300 font-bold">You dictate the room, lots & gavel strikes</span>
                ) : isWinning ? (
                  <span className="text-[#34d399] font-bold flex items-center gap-1">
                    <span>✓</span>
                    <span>You hold the highest bid! Awaiting counter-bids or gavel.</span>
                  </span>
                ) : isOptedOut ? (
                  <span className="text-amber-400 font-bold">You backed off — Tap 'Jump Back In' anytime to resume bidding</span>
                ) : (
                  <span>Tap a paddle increment to raise bid instantly</span>
                )}
              </p>
            </div>

            {!isNeutralAuctioneer ? (
              <div className="text-right bg-[#040c08]/90 border border-[#d4be8c]/30 px-3 py-1 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                <span className="text-[9px] uppercase font-mono text-white/50 block font-bold leading-none">
                  YOUR PURSE
                </span>
                <span className="text-base font-bold font-mono text-[#34d399] leading-none mt-0.5 block drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                  {formatLakhsAndCrores(myBudget, true)}
                </span>
                {isCritical && (
                  <span className="text-[8px] font-mono text-rose-400 font-bold block">
                    Reserve: {formatLakhsAndCrores(reserveNeeded, true)}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-right bg-[#d4be8c]/15 border border-[#d4be8c]/40 px-3 py-1 rounded-xl shadow-xs">
                <span className="text-[9px] uppercase font-mono text-[#ecdcb8] block font-black leading-none">
                  AUTHORITY
                </span>
                <span className="text-xs font-black font-mono text-[#d4be8c] leading-none mt-0.5 block">
                  Gavel Master
                </span>
              </div>
            )}
          </div>

          {/* 🌟 Auctioneer Authority & Busy / Leaving Strip */}
          {(isHost || isNeutralAuctioneer) && (
            <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10 font-mono text-[10px] flex-wrap">
              {onToggleAuctioneerBusy && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleAuctioneerBusy();
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs border ${
                    isAuctioneerBusy
                      ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-500 animate-pulse"
                      : "bg-[#040c08] hover:bg-amber-950/40 text-amber-300 border-amber-500/40"
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
                  className="px-2.5 py-1 rounded-lg bg-[#040c08] hover:bg-[#0b1c15] text-[#ecdcb8] border border-[#d4be8c]/30 font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
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
                      ? "bg-emerald-950/60 text-[#34d399] border-emerald-500/40"
                      : "bg-[#040c08] text-white/50 border-white/10 hover:text-white"
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
                  className="px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/30 font-bold transition-all cursor-pointer shadow-xs ml-auto flex items-center gap-1"
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
              <span className="text-[10px] uppercase font-mono font-bold text-[#d4be8c] tracking-wider">
                RAISE PADDLE ({basePrice >= 200 ? "MARQUEE 2 CR" : basePrice >= 100 ? "SENIOR 1 CR" : "50 LAKHS"})
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#34d399] font-bold">
                  Current: {formatLakhsAndCrores(currentBid, true)}
                </span>

                {/* ✋ Bidder Opt-Out "Back Off" / "No Call" Toggle */}
                {!isOptedOut && !isWinning && !isLocked && onOptOut && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOptOut(true);
                    }}
                    className="text-[10px] font-mono font-bold text-white/60 hover:text-rose-300 bg-[#040c08] hover:bg-rose-950/30 border border-white/10 hover:border-rose-500/40 px-2 py-0.5 rounded-lg transition-all cursor-pointer shadow-xs"
                    title="Opt out / Pass on this lot"
                  >
                    ✋ Back Off / No Call
                  </button>
                )}
              </div>
            </div>

            {/* If opted out, show the Jump Back In banner */}
            {isOptedOut ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#040c08] to-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                    <span>✋</span>
                    <span>YOU BACKED OFF (NO CALL)</span>
                  </div>
                  <p className="text-[10px] text-white/50 font-mono mt-0.5">
                    Your paddle is parked for this lot. Change your mind? Re-enter anytime!
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOptOut(false);
                  }}
                  disabled={isLocked}
                  className="px-3.5 py-2 bg-gradient-to-b from-[#34d399] via-[#10b981] to-[#059669] hover:from-[#10b981] hover:to-[#047857] text-[#040c08] rounded-xl text-xs font-mono font-black uppercase tracking-wider transition-all border border-[#34d399] border-b-[3px] border-b-[#033b28] shadow-xs active:translate-y-0.5 active:border-b-[1px] cursor-pointer shrink-0 disabled:opacity-40"
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
                          ? "bg-[#07120d]/60 text-white/20 border border-white/5 opacity-40 cursor-not-allowed"
                          : "bg-gradient-to-b from-[#132a20] via-[#0d2118] to-[#071510] hover:from-[#1b3d2e] hover:to-[#0b1c15] text-white border border-[#34d399]/30 hover:border-[#34d399]/70 border-b-[4px] border-b-[#030906] active:translate-y-1 active:border-b-[1px] shadow-[0_6px_14px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                      }`}
                      title={
                        isWinning
                          ? "You already hold the highest bid"
                          : !canAfford
                          ? `Insufficient funds (Requires ${formatLakhsAndCrores(nextTotal, true)})`
                          : inc.subtitle
                      }
                    >
                      <span className="text-sm font-black font-mono leading-none text-[#ecdcb8] group-hover:text-[#34d399] group-hover:scale-110 transition-transform drop-shadow-xs">
                        {inc.label}
                      </span>
                      <span className="text-[9px] text-white/60 mt-1 font-mono font-bold group-hover:text-white/90">
                        {formatLakhsAndCrores(nextTotal, true)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Hover preview information strip */}
            {hoveredInc && !isWinning && !isOptedOut && (
              <div className="mt-2 text-[10px] font-mono bg-[#040c08]/90 text-white/70 px-3 py-1.5 rounded-xl border border-[#d4be8c]/25 flex items-center justify-between shadow-inner">
                <span>Paddle {hoveredInc.label}: New bid will be <strong className="text-[#34d399]">{formatLakhsAndCrores(currentBid + hoveredInc.amount, false)}</strong></span>
                <span>Purse after: <strong className="text-[#34d399]">{formatLakhsAndCrores(Math.max(0, myBudget - (currentBid + hoveredInc.amount)), true)}</strong></span>
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
                  className={`w-full py-2.5 px-3.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 border shadow-xs cursor-pointer ${
                    isWinning
                      ? "bg-[#040c08] text-white/30 border-white/5 cursor-not-allowed opacity-60"
                      : isLocked
                      ? "bg-[#040c08] text-white/30 border-white/5 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-b from-[#240c0d] via-[#1a0809] to-[#120506] hover:from-[#2e0f10] text-rose-300 border border-rose-500/30 border-b-[3px] border-b-rose-950 active:translate-y-0.5 active:border-b-[1px]"
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
                    <span className="text-[10px] text-rose-400/80 font-normal hidden sm:inline">
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
      <div className="pt-3 mt-3 border-t border-white/10 flex flex-col gap-2">
        {canUseHammer ? (
          <div className="space-y-2">
            {/* Cast-Iron & Turned Wood Gavel Strike Action */}
            <button
              onClick={handleHammerClick}
              disabled={isLocked}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                isLocked
                  ? "bg-[#07120d]/70 text-white/30 cursor-not-allowed border border-white/5"
                  : hasBids
                  ? "bg-gradient-to-b from-[#1c5d46] via-[#124032] to-[#0a261e] hover:from-[#237357] hover:to-[#0e352a] text-white border border-[#34d399]/50 border-b-[5px] border-b-[#04120e] shadow-[0_8px_24px_rgba(18,64,50,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-1 active:border-b-[1px]"
                  : "bg-gradient-to-b from-[#92400e] via-[#78350f] to-[#451a03] hover:from-[#a14810] hover:to-[#572005] text-white border border-amber-500/40 border-b-[5px] border-b-[#260c01] shadow-[0_8px_24px_rgba(146,64,14,0.4),inset_0_1px_0_rgba(255,255,255,0.15)] active:translate-y-1 active:border-b-[1px]"
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
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[11px] font-mono">
              <button
                onClick={() => {
                  sounds.playClick();
                  onExtendTimer();
                }}
                disabled={isLocked}
                className="py-2.5 px-2 bg-gradient-to-b from-[#132a20] to-[#071510] hover:from-[#1b3d2e] hover:to-[#0b1c15] text-[#ecdcb8] rounded-xl border border-[#d4be8c]/25 border-b-[3px] border-b-[#030906] transition-all disabled:opacity-40 cursor-pointer text-center truncate font-bold shadow-xs active:translate-y-0.5 active:border-b-[1px]"
                title="Add 15s Fair Warning"
              >
                ⏱️ +15s Clock
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onResetTimer();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-[#132a20] to-[#071510] hover:from-[#1b3d2e] hover:to-[#0b1c15] text-[#ecdcb8] rounded-xl border border-[#d4be8c]/25 border-b-[3px] border-b-[#030906] transition-all cursor-pointer text-center truncate font-bold shadow-xs active:translate-y-0.5 active:border-b-[1px]"
                title="Reset 60s Clock"
              >
                🔄 Reset Clock
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNextLot();
                }}
                className="py-2.5 px-2 bg-gradient-to-b from-[#1a4d3b] via-[#124032] to-[#0b2b21] hover:from-[#215f4a] hover:to-[#0e352a] text-[#34d399] rounded-xl border border-[#34d399]/40 border-b-[3px] border-b-[#051711] transition-all cursor-pointer text-center truncate font-black shadow-xs active:translate-y-0.5 active:border-b-[1px]"
                title="Nominate Next Lot from Catalog"
              >
                ⏭️ Next Lot
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full py-3.5 px-4 rounded-2xl bg-[#040c08]/80 border border-[#d4be8c]/20 text-center text-xs font-mono text-white/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
            {status === "sold" ? (
              <span className="text-[#34d399] font-black">Player Sold by Auction Gavel</span>
            ) : status === "unsold" ? (
              <span className="text-rose-400 font-black">Player Passed Unsold</span>
            ) : isWinning ? (
              <span className="text-[#34d399] font-black">You currently hold the winning bid!</span>
            ) : hasBids ? (
              <span className="text-white font-bold">Highest Bid: {formatLakhsAndCrores(currentBid, false)} • Gavel held by Room Authority</span>
            ) : (
              <span className="text-white/40">Gavel held by Room Authority (Passes if host leaves or allows)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}