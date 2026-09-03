"use client";

import { Oswald } from "next/font/google";
import PlayerAvatar from "./PlayerAvatar";

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

  return (
    <div className="relative w-full bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] border border-[#dcd6c8] rounded-3xl p-5 flex flex-col justify-between select-none shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_28px_rgba(0,0,0,0.05),0_24px_48px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-black/[0.03] flex-1 min-h-[380px] text-[#121417]">
      {/* Decorative Corner Rivets */}
      <span className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-[#d0c9b8] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />
      <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#d0c9b8] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />
      <span className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-[#d0c9b8] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />
      <span className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-[#d0c9b8] shadow-[inset_0_1px_1px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.8)]" />

      {/* Top Header info */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#f3f0e8] border border-[#dfd9cb] px-2.5 py-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] text-xs font-mono font-bold text-[#454a50]">
            <span className="text-sm leading-none">{flag}</span>
            <span className="uppercase tracking-wider">{country}</span>
          </div>
          {isOverseas && (
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 px-2 py-0.5 rounded-lg shadow-xs">
              OVERSEAS
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#555a60] bg-[#f3f0e8] border border-[#dfd9cb] px-2.5 py-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            {role}
          </span>
          <span className="text-xs font-mono font-black text-[#121417] bg-gradient-to-b from-[#fbf5e6] to-[#eddcb7] border border-[#d4be8c] px-2.5 py-1 rounded-xl shadow-xs">
            ★ {rating} OVR
          </span>
        </div>
      </div>

      {/* Center Spotlight & Player Showcase */}
      <div className="relative my-3.5 p-3 rounded-2xl bg-gradient-to-b from-[#faf8f2] to-[#f2eee3] border border-[#e0d9ca] shadow-[inset_0_2px_5px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.9)] flex items-center gap-4">
        {/* Subtle Radial Spotlight Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(254,243,199,0.5),transparent_60%)] rounded-2xl pointer-events-none" />

        <div className="relative shrink-0 filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.12)]">
          <PlayerAvatar
            name={name}
            role={role}
            imageUrl={imageUrl}
            flag={flag}
            size="lg"
          />
        </div>

        <div className="relative flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#124032]/10 border border-[#124032]/20 text-[10px] font-mono uppercase tracking-widest text-[#124032] font-bold mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#124032]" />
            <span>LOT ON THE BLOCK</span>
          </div>

          <h3 className={`text-2xl font-bold uppercase tracking-tight truncate text-[#121417] drop-shadow-2xs ${oswald.className}`}>
            {name}
          </h3>

          <div className="text-xs font-mono text-[#555a60] mt-1 flex items-center gap-2">
            <span className="text-[11px] text-[#767c84]">RESERVE PRICE:</span>
            <span className="font-bold text-[#121417] bg-white px-2 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">
              ₹{(basePrice / 100).toFixed(2)} CR
            </span>
          </div>
        </div>
      </div>

      {/* 3D Tactile Stats Chips */}
      <div className="grid grid-cols-3 gap-2.5 my-1">
        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-2 border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] block">
            {isBowler ? "WICKETS" : "T20 RUNS"}
          </span>
          <span className={`text-lg font-bold text-[#121417] block mt-0.5 ${oswald.className}`}>
            {isBowler ? stats?.wickets || 85 : stats?.runs || 4200}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-2 border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] block">
            {isBowler ? "ECONOMY" : "STRIKE RATE"}
          </span>
          <span className={`text-lg font-bold text-[#124032] block mt-0.5 ${oswald.className}`}>
            {isBowler ? stats?.economy || "7.60" : stats?.sr || "138.5"}
          </span>
        </div>

        <div className="bg-gradient-to-b from-white to-[#f7f5ee] border border-[#dfd9cb] border-b-2 border-b-[#c9c2b2] rounded-2xl p-2.5 text-center shadow-[0_2px_4px_rgba(0,0,0,0.03)]">
          <span className="text-[10px] font-mono font-bold uppercase text-[#767c84] block">
            {isBowler ? "AVERAGE" : isWK ? "DISMISSALS" : "AVERAGE"}
          </span>
          <span className={`text-lg font-bold text-[#121417] block mt-0.5 ${oswald.className}`}>
            {isBowler ? stats?.avg || "22.4" : isWK ? stats?.catches || 110 : stats?.avg || "34.2"}
          </span>
        </div>
      </div>

      {/* Engraved High Bid Plaque with Metallic Brass Rim */}
      <div className="relative bg-gradient-to-b from-[#f7f3e6] via-[#ede6d1] to-[#e4dcc7] border-2 border-[#d0c6ad] rounded-2xl p-3.5 flex items-center justify-between mt-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06),0_2px_5px_rgba(0,0,0,0.04)]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#767c84] block font-black flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>CURRENT HIGH BID</span>
          </span>
          <span className="text-xs font-mono text-[#555a60] truncate block mt-0.5 max-w-[210px]">
            {highestBidder && highestBidder !== "No Bids Yet" ? (
              <span>Held by <strong className="text-[#121417] font-bold">{highestBidder}</strong></span>
            ) : (
              <span className="italic text-[#8c8577]">Awaiting opening nomination</span>
            )}
          </span>
        </div>

        <div className="text-right">
          <span className={`text-3xl font-bold text-[#121417] tracking-tight leading-none block drop-shadow-2xs ${oswald.className}`}>
            ₹{(currentBid / 100).toFixed(2)} CR
          </span>
        </div>
      </div>
    </div>
  );
}