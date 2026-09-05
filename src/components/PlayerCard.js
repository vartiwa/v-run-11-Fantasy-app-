"use client";

import { useEffect, useState } from "react";
import { Oswald } from "next/font/google";
import PlayerAvatar from "./PlayerAvatar";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";
import { RupeeCoinIcon } from "./AuctionIcons";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

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

  return (
    <div className="relative w-full bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] border border-[#c6ded0] rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] ring-1 ring-[#059669]/10 flex-1 min-h-[400px] text-[#12241b] overflow-hidden">
      {/* Top Foil Sheen Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Decorative Corner Rivets */}
      <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e2ece5] to-[#b7cebf] shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-[#c2dcce]" />
      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e2ece5] to-[#b7cebf] shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-[#c2dcce]" />
      <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e2ece5] to-[#b7cebf] shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-[#c2dcce]" />
      <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e2ece5] to-[#b7cebf] shadow-[inset_0_1px_1px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] border border-[#c2dcce]" />

      {/* Top Header info */}
      <div className="flex items-center justify-between pb-3 border-b border-[#cfe0d5]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#eef5f1] border border-[#cbe0d3] px-2.5 py-1 rounded-xl shadow-inner text-xs font-mono font-bold text-[#0e2c1e]">
            <span className="text-sm leading-none">{flag}</span>
            <span className="uppercase tracking-wider">{country}</span>
          </div>
          {isOverseas && (
            <span className="text-[10px] font-mono font-black text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-lg shadow-sm">
              ✈ OVERSEAS
            </span>
          )}
          <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg shadow-sm uppercase tracking-wider ${
            basePrice >= 200
              ? "bg-gradient-to-r from-[#fef3c7] to-[#fde68a] text-[#854d0e] border border-[#f59e0b]/40"
              : basePrice >= 100
              ? "bg-[#e6f4ea] text-[#0f5132] border border-[#34d399]/40"
              : "bg-[#eef5f1] text-[#3b5947] border border-[#cbe0d3]"
          }`}>
            {basePrice >= 200 ? "👑 Marquee Tier" : basePrice >= 100 ? "★ Senior Lot" : "Emerging Lot"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#0e2c1e] bg-[#eef5f1] border border-[#cbe0d3] px-2.5 py-1 rounded-xl shadow-inner">
            {role}
          </span>
          <span className="text-xs font-mono font-black text-[#854d0e] bg-[#fef3c7] border border-[#f59e0b]/40 px-2.5 py-1 rounded-xl shadow-sm">
            ★ {rating} OVR
          </span>
        </div>
      </div>

      {/* Center Spotlight & Player Showcase */}
      <div className="relative my-3 p-3.5 rounded-2xl bg-gradient-to-b from-white via-[#f3f8f5] to-[#e6f0e9] border border-[#c4ded0] shadow-[inset_0_1px_3px_rgba(255,255,255,0.8),0_4px_16px_rgba(18,64,50,0.06)] flex items-center gap-4">
        {/* Subtle Radial Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(16,185,129,0.1),transparent_70%)] rounded-2xl pointer-events-none" />

        <div className="relative shrink-0 filter drop-shadow-[0_8px_16px_rgba(18,64,50,0.15)]">
          <PlayerAvatar
            name={name}
            role={role}
            imageUrl={imageUrl}
            flag={flag}
            size="lg"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#e6f7ee] text-[#047857] border border-[#a7f3d0] text-[9px] font-mono uppercase tracking-widest font-black mb-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span>ACTIVE ON BLOCK</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-tight truncate text-[#0e2c1e] drop-shadow-xs ${oswald.className}`}>
            {name}
          </h3>

          <div className="text-xs font-mono text-[#5c7567] mt-1.5 flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">BASE NOMINATION:</span>
            <span className="font-bold font-mono text-xs text-[#854d0e] bg-white px-2.5 py-0.5 rounded-md border border-[#badbc6] shadow-inner">
              {formatLakhsAndCrores(basePrice, false)}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Tactile Stats Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        <div className="bg-gradient-to-b from-white via-[#f7faf8] to-[#eaf3ed] border border-[#badbc6] border-b-[3px] border-b-[#93be9f] rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(18,64,50,0.05)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "WICKETS" : "T20 RUNS"}
          </span>
          <span className={`text-xl font-bold text-[#0e2c1e] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.wickets || 85 : stats?.runs || 4200}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white via-[#f7faf8] to-[#eaf3ed] border border-[#badbc6] border-b-[3px] border-b-[#93be9f] rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(18,64,50,0.05)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "ECONOMY" : "STRIKE RATE"}
          </span>
          <span className={`text-xl font-bold text-[#047857] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.economy || "7.60" : stats?.sr || "138.5"}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white via-[#f7faf8] to-[#eaf3ed] border border-[#badbc6] border-b-[3px] border-b-[#93be9f] rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(18,64,50,0.05)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#5c7567] tracking-wider block">
            {isBowler ? "AVERAGE" : isWK ? "DISMISSALS" : "AVERAGE"}
          </span>
          <span className={`text-xl font-bold text-[#0e2c1e] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.avg || "22.4" : isWK ? stats?.catches || 110 : stats?.avg || "34.2"}
          </span>
        </div>
      </div>

      {/* Engraved High Bid Plaque with Dynamic Aura Pulse */}
      <div
        className={`relative bg-gradient-to-b from-[#eaf4ed] via-[#f1f7f3] to-[#e2ece5] border-2 rounded-2xl p-3.5 flex items-center justify-between mt-2 shadow-[inset_0_1px_3px_rgba(255,255,255,0.9),0_6px_20px_rgba(18,64,50,0.06)] transition-all duration-300 ${
          bidPulse
            ? "border-[#d4be8c] ring-4 ring-[#d4be8c]/30 scale-[1.01]"
            : "border-[#badbc6]"
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#854d0e] block font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d97706] animate-ping" />
            <RupeeCoinIcon className="w-4 h-4 text-[#d97706]" />
            <span>CURRENT HIGH BID</span>
          </span>
          <span className="text-xs font-mono text-[#5c7567] truncate block mt-0.5 max-w-[220px]">
            {highestBidder && highestBidder !== "No Bids Yet" ? (
              <span>Held by <strong className="text-[#0e2c1e] font-black">{highestBidder.split(" - ")[0]}</strong></span>
            ) : (
              <span className="italic text-[#7d9b89]">Awaiting opening paddle</span>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className={`text-3xl sm:text-4xl font-black text-[#0f3d2a] tracking-tight leading-none block drop-shadow-xs ${oswald.className}`}>
            {formatLakhsAndCrores(currentBid, false)}
          </span>
        </div>
      </div>
    </div>
  );
}