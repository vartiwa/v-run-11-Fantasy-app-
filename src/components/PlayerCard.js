"use client";

import { useEffect, useState } from "react";
import { Outfit } from "next/font/google";
import PlayerAvatar from "./PlayerAvatar";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";
import { CrownIcon, StarIcon, PlaneIcon } from "./AuctionIcons";

const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"] });

export default function PlayerCard({
  name,
  role,
  country = "IND",
  flag = "🇮🇳",
  isOverseas = false,
  basePrice = 200,
  currentBid = 200,
  imageUrl,
  highestBidder,
  stats = {},
  rating = 90,
}) {
  const isBowler = role === "Bowler";
  const isWK = role === "Wicket Keeper";

  const [bidPulse, setBidPulse] = useState(false);

  // Trigger brief visual pulse when bid rises
  useEffect(() => {
    setBidPulse(true);
    const t = setTimeout(() => setBidPulse(false), 600);
    return () => clearTimeout(t);
  }, [currentBid]);

  const hasBids = highestBidder && highestBidder !== "No Bids Yet";
  const leaderFranchise = hasBids ? highestBidder.split(" - ")[0] : null;

  return (
    <div className="relative w-full h-full bg-white/95 backdrop-blur-xl border border-[#cfe0d5] rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_12px_32px_rgba(18,64,50,0.06),0_2px_8px_rgba(18,64,50,0.03)] text-[#12241b] overflow-hidden">
      {/* Top Foil Sheen Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Top Badges & Tier Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e4eee6]">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Country & Flag */}
          <div className="flex items-center gap-1.5 bg-[#f0f6f2] border border-[#cbe0d3] px-2.5 py-1 rounded-xl text-xs font-semibold text-[#0e2c1e]">
            <span className="text-sm leading-none">{flag}</span>
            <span className="uppercase tracking-wider">{country}</span>
          </div>

          {/* Overseas indicator */}
          {isOverseas && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 border border-amber-300/80 px-2 py-0.5 rounded-lg shadow-2xs">
              <PlaneIcon className="w-3 h-3 text-amber-700" />
              <span>OVERSEAS</span>
            </span>
          )}

          {/* Tier Badge */}
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-2xs uppercase tracking-wider ${
              basePrice >= 200
                ? "bg-amber-50 text-amber-900 border border-amber-300/80"
                : basePrice >= 100
                ? "bg-[#e8f5ed] text-[#0f5132] border border-[#a3d9b6]"
                : "bg-[#f0f6f2] text-[#3b5947] border border-[#cbe0d3]"
            }`}
          >
            {basePrice >= 200 ? (
              <>
                <CrownIcon className="w-3 h-3 text-amber-700" />
                <span>Marquee Tier</span>
              </>
            ) : basePrice >= 100 ? (
              <>
                <StarIcon className="w-2.5 h-2.5 text-[#0f5132]" />
                <span>Senior Lot</span>
              </>
            ) : (
              <span>Emerging Lot</span>
            )}
          </span>
        </div>

        {/* Role & Rating */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-[#0e2c1e] bg-[#f0f6f2] border border-[#cbe0d3] px-2.5 py-1 rounded-xl">
            {role}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300/80 px-2.5 py-1 rounded-xl shadow-2xs">
            <StarIcon className="w-3 h-3 text-amber-600" />
            <span>{rating} OVR</span>
          </span>
        </div>
      </div>

      {/* Center Athlete Showcase */}
      <div className="relative my-4 p-4 rounded-2xl bg-gradient-to-b from-[#fbfdfc] to-[#f2f7f4] border border-[#d6e6dc] flex items-center gap-4 shadow-2xs">
        <div className="relative shrink-0 filter drop-shadow-[0_6px_14px_rgba(18,64,50,0.12)]">
          <PlayerAvatar
            name={name}
            role={role}
            imageUrl={imageUrl}
            flag={flag}
            size="lg"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0] text-[10px] uppercase tracking-wider font-bold mb-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span>ON THE BLOCK</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-tight truncate text-[#0e2c1e] leading-tight ${outfit.className}`}>
            {name}
          </h3>

          <div className="text-xs text-[#5c7567] mt-1 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Base Price:</span>
            <span className="font-bold text-xs text-[#854d0e] bg-white px-2 py-0.5 rounded-md border border-[#cbe0d3] font-mono shadow-2xs">
              {formatLakhsAndCrores(basePrice, false)}
            </span>
          </div>
        </div>
      </div>

      {/* Clean 3-Metric Performance Grid */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        <div className="bg-[#f7faf8] border border-[#d6e6dc] rounded-2xl p-2.5 text-center transition-all hover:bg-white hover:border-[#b8d8c4] hover:shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "Wickets" : "T20 Runs"}
          </span>
          <span className={`text-2xl font-extrabold text-[#0e2c1e] block mt-0.5 leading-none ${outfit.className}`}>
            {isBowler ? stats?.wickets || 85 : stats?.runs || 4200}
          </span>
        </div>

        <div className="bg-[#f7faf8] border border-[#d6e6dc] rounded-2xl p-2.5 text-center transition-all hover:bg-white hover:border-[#b8d8c4] hover:shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "Economy" : "Strike Rate"}
          </span>
          <span className={`text-2xl font-extrabold text-[#047857] block mt-0.5 leading-none ${outfit.className}`}>
            {isBowler ? stats?.economy || "7.60" : stats?.sr || "138.5"}
          </span>
        </div>

        <div className="bg-[#f7faf8] border border-[#d6e6dc] rounded-2xl p-2.5 text-center transition-all hover:bg-white hover:border-[#b8d8c4] hover:shadow-xs">
          <span className="text-[10px] font-semibold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "Average" : isWK ? "Catches" : "Average"}
          </span>
          <span className={`text-2xl font-extrabold text-[#0e2c1e] block mt-0.5 leading-none ${outfit.className}`}>
            {isBowler ? stats?.avg || "22.4" : isWK ? stats?.catches || 110 : stats?.avg || "34.2"}
          </span>
        </div>
      </div>

      {/* Live High Bid Plaque */}
      <div
        className={`relative bg-gradient-to-b from-[#edf5f0] to-[#e4eee7] border rounded-2xl p-3.5 flex items-center justify-between mt-2 shadow-inner transition-all duration-300 ${
          bidPulse
            ? "border-[#10b981] ring-2 ring-[#10b981]/30 scale-[1.01]"
            : "border-[#c4ded0]"
        }`}
      >
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#065f46] block font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
            <span>CURRENT HIGH BID</span>
          </span>
          <span className="text-xs text-[#5c7567] truncate block mt-0.5 max-w-[200px]">
            {leaderFranchise ? (
              <span>Held by <strong className="text-[#0e2c1e] font-bold">{leaderFranchise}</strong></span>
            ) : (
              <span className="italic text-[#7d9b89]">Awaiting opening paddle</span>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-black text-[#047857] tracking-tight leading-none block drop-shadow-2xs font-mono ${outfit.className}`}>
            {formatLakhsAndCrores(currentBid, false)}
          </span>
        </div>
      </div>
    </div>
  );
}