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
    <div className="relative w-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border-2 border-[#d6cfbe] rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_4px_6px_rgba(0,0,0,0.02),0_16px_36px_rgba(18,64,50,0.06),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-[#124032]/5 flex-1 min-h-[400px] text-[#121417] overflow-hidden">
      {/* Top Foil Sheen Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#124032] to-[#d4be8c] opacity-80" />

      {/* Decorative Corner Rivets */}
      <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e8e2d4] to-[#b8af9c] shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.9)]" />
      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e8e2d4] to-[#b8af9c] shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.9)]" />
      <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e8e2d4] to-[#b8af9c] shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.9)]" />
      <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#e8e2d4] to-[#b8af9c] shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.9)]" />

      {/* Top Header info */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white border border-[#dfd9cb] px-2.5 py-1 rounded-xl shadow-2xs text-xs font-mono font-bold text-[#454a50]">
            <span className="text-sm leading-none">{flag}</span>
            <span className="uppercase tracking-wider">{country}</span>
          </div>
          {isOverseas && (
            <span className="text-[10px] font-mono font-black text-amber-950 bg-gradient-to-b from-[#fef3c7] to-[#fde68a] border border-amber-400 px-2.5 py-0.5 rounded-lg shadow-2xs">
              ✈ OVERSEAS
            </span>
          )}
          <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg shadow-2xs uppercase tracking-wider ${
            basePrice >= 200
              ? "bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] text-[#5c4308] border border-[#d4be8c]"
              : basePrice >= 100
              ? "bg-[#eef5f1] text-[#124032] border border-[#b2ddc4]"
              : "bg-white text-[#555a60] border border-[#d8d1c0]"
          }`}>
            {basePrice >= 200 ? "👑 Marquee Tier" : basePrice >= 100 ? "★ Senior Lot" : "Emerging Lot"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#454a50] bg-white border border-[#dfd9cb] px-2.5 py-1 rounded-xl shadow-2xs">
            {role}
          </span>
          <span className="text-xs font-mono font-black text-[#5c4308] bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] border border-[#d4be8c] px-2.5 py-1 rounded-xl shadow-2xs">
            ★ {rating} OVR
          </span>
        </div>
      </div>

      {/* Center Spotlight & Player Showcase */}
      <div className="relative my-3 p-3.5 rounded-2xl bg-gradient-to-b from-[#faf8f2] via-[#f5f1e6] to-[#eee8d9] border border-[#ded5c2] shadow-[inset_0_2px_6px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.02)] flex items-center gap-4">
        {/* Subtle Radial Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(212,190,140,0.35),transparent_65%)] rounded-2xl pointer-events-none" />

        <div className="relative shrink-0 filter drop-shadow-[0_10px_16px_rgba(18,64,50,0.15)]">
          <PlayerAvatar
            name={name}
            role={role}
            imageUrl={imageUrl}
            flag={flag}
            size="lg"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#124032] text-white text-[9px] font-mono uppercase tracking-widest font-black mb-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE ON BLOCK</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-tight truncate text-[#121417] drop-shadow-xs ${oswald.className}`}>
            {name}
          </h3>

          <div className="text-xs font-mono text-[#555a60] mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-[#767c84] uppercase font-bold tracking-wider">BASE NOMINATION:</span>
            <span className="font-bold font-mono text-xs text-[#124032] bg-white px-2.5 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">
              {formatLakhsAndCrores(basePrice, false)}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Tactile Stats Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-[3px] border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] tracking-wider block">
            {isBowler ? "WICKETS" : "T20 RUNS"}
          </span>
          <span className={`text-xl font-bold text-[#121417] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.wickets || 85 : stats?.runs || 4200}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-[3px] border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] tracking-wider block">
            {isBowler ? "ECONOMY" : "STRIKE RATE"}
          </span>
          <span className={`text-xl font-bold text-[#124032] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.economy || "7.60" : stats?.sr || "138.5"}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-[3px] border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] tracking-wider block">
            {isBowler ? "AVERAGE" : isWK ? "DISMISSALS" : "AVERAGE"}
          </span>
          <span className={`text-xl font-bold text-[#121417] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.avg || "22.4" : isWK ? stats?.catches || 110 : stats?.avg || "34.2"}
          </span>
        </div>
      </div>

      {/* Engraved Brass High Bid Plaque with Dynamic Aura Pulse */}
      <div
        className={`relative bg-gradient-to-b from-[#fbf5e6] via-[#ede2c5] to-[#decfa8] border-2 rounded-2xl p-3.5 flex items-center justify-between mt-2 shadow-[inset_0_2px_6px_rgba(255,255,255,0.7),0_4px_12px_rgba(92,67,8,0.12)] transition-all duration-300 ${
          bidPulse
            ? "border-amber-500 ring-4 ring-amber-400/30 scale-[1.01]"
            : "border-[#caa663]"
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5c4308] block font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <RupeeCoinIcon className="w-4 h-4 text-[#5c4308]" />
            <span>CURRENT HIGH BID</span>
          </span>
          <span className="text-xs font-mono text-[#45330a] truncate block mt-0.5 max-w-[220px]">
            {highestBidder && highestBidder !== "No Bids Yet" ? (
              <span>Held by <strong className="text-[#121417] font-black">{highestBidder.split(" - ")[0]}</strong></span>
            ) : (
              <span className="italic text-[#786438]">Awaiting opening paddle</span>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className={`text-3xl sm:text-4xl font-black text-[#121417] tracking-tight leading-none block drop-shadow-xs ${oswald.className}`}>
            {formatLakhsAndCrores(currentBid, false)}
          </span>
        </div>
      </div>
    </div>
  );
}