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
    <div className="relative w-full bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-[#d4be8c]/30 rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_35px_rgba(18,64,50,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-[#d4be8c]/20 flex-1 min-h-[400px] text-white overflow-hidden">
      {/* Top Foil Sheen Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#34d399] to-[#d4be8c] opacity-90 shadow-sm" />

      {/* Decorative Corner Rivets */}
      <span className="absolute top-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#d4be8c] to-[#735e38] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.2)]" />
      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#d4be8c] to-[#735e38] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.2)]" />
      <span className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#d4be8c] to-[#735e38] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.2)]" />
      <span className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-gradient-to-b from-[#d4be8c] to-[#735e38] shadow-[inset_0_1px_1px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.2)]" />

      {/* Top Header info */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 px-2.5 py-1 rounded-xl shadow-inner text-xs font-mono font-bold text-white/80">
            <span className="text-sm leading-none">{flag}</span>
            <span className="uppercase tracking-wider">{country}</span>
          </div>
          {isOverseas && (
            <span className="text-[10px] font-mono font-black text-[#fef08a] bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-lg shadow-sm">
              ✈ OVERSEAS
            </span>
          )}
          <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-lg shadow-sm uppercase tracking-wider ${
            basePrice >= 200
              ? "bg-gradient-to-r from-[#d4be8c]/20 to-[#c7ad72]/30 text-[#d4be8c] border border-[#d4be8c]/50"
              : basePrice >= 100
              ? "bg-[#124032] text-[#34d399] border border-[#34d399]/40"
              : "bg-white/5 text-white/70 border border-white/10"
          }`}>
            {basePrice >= 200 ? "👑 Marquee Tier" : basePrice >= 100 ? "★ Senior Lot" : "Emerging Lot"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-white/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl shadow-inner">
            {role}
          </span>
          <span className="text-xs font-mono font-black text-[#d4be8c] bg-[#124032] border border-[#d4be8c]/40 px-2.5 py-1 rounded-xl shadow-sm">
            ★ {rating} OVR
          </span>
        </div>
      </div>

      {/* Center Spotlight & Player Showcase */}
      <div className="relative my-3 p-3.5 rounded-2xl bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent border border-white/10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)] flex items-center gap-4">
        {/* Subtle Radial Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(18,64,50,0.6),transparent_70%)] rounded-2xl pointer-events-none" />

        <div className="relative shrink-0 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]">
          <PlayerAvatar
            name={name}
            role={role}
            imageUrl={imageUrl}
            flag={flag}
            size="lg"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#124032] text-[#34d399] border border-[#34d399]/30 text-[9px] font-mono uppercase tracking-widest font-black mb-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            <span>ACTIVE ON BLOCK</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-tight truncate text-white drop-shadow-md ${oswald.className}`}>
            {name}
          </h3>

          <div className="text-xs font-mono text-white/60 mt-1.5 flex items-center gap-2">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">BASE NOMINATION:</span>
            <span className="font-bold font-mono text-xs text-[#d4be8c] bg-white/5 px-2.5 py-0.5 rounded-md border border-[#d4be8c]/30 shadow-inner">
              {formatLakhsAndCrores(basePrice, false)}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Tactile Stats Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 border-b-[3px] border-b-black/40 rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-white/40 tracking-wider block">
            {isBowler ? "WICKETS" : "T20 RUNS"}
          </span>
          <span className={`text-xl font-bold text-white block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.wickets || 85 : stats?.runs || 4200}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 border-b-[3px] border-b-black/40 rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-white/40 tracking-wider block">
            {isBowler ? "ECONOMY" : "STRIKE RATE"}
          </span>
          <span className={`text-xl font-bold text-[#34d399] block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.economy || "7.60" : stats?.sr || "138.5"}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 border-b-[3px] border-b-black/40 rounded-2xl p-2.5 text-center shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 transition-transform">
          <span className="text-[10px] font-mono font-bold uppercase text-white/40 tracking-wider block">
            {isBowler ? "AVERAGE" : isWK ? "DISMISSALS" : "AVERAGE"}
          </span>
          <span className={`text-xl font-bold text-white block mt-0.5 leading-none ${oswald.className}`}>
            {isBowler ? stats?.avg || "22.4" : isWK ? stats?.catches || 110 : stats?.avg || "34.2"}
          </span>
        </div>
      </div>

      {/* Engraved High Bid Plaque with Dynamic Aura Pulse */}
      <div
        className={`relative bg-gradient-to-b from-[#124032]/80 via-[#0a231b]/90 to-[#061711] border-2 rounded-2xl p-3.5 flex items-center justify-between mt-2 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.6)] transition-all duration-300 ${
          bidPulse
            ? "border-[#d4be8c] ring-4 ring-[#d4be8c]/40 scale-[1.01]"
            : "border-[#d4be8c]/50"
        }`}
      >
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4be8c] block font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d4be8c] animate-ping" />
            <RupeeCoinIcon className="w-4 h-4 text-[#d4be8c]" />
            <span>CURRENT HIGH BID</span>
          </span>
          <span className="text-xs font-mono text-white/70 truncate block mt-0.5 max-w-[220px]">
            {highestBidder && highestBidder !== "No Bids Yet" ? (
              <span>Held by <strong className="text-white font-black">{highestBidder.split(" - ")[0]}</strong></span>
            ) : (
              <span className="italic text-white/40">Awaiting opening paddle</span>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#d4be8c] via-[#f7ecd5] to-[#d4be8c] tracking-tight leading-none block drop-shadow-md ${oswald.className}`}>
            {formatLakhsAndCrores(currentBid, false)}
          </span>
        </div>
      </div>
    </div>
  );
}