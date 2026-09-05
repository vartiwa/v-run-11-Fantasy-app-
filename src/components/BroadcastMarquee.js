"use client";

import { useMemo } from "react";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";

export default function BroadcastMarquee({
  auctionData = {},
  playersList = [],
  allTeams = {},
}) {
  const stats = useMemo(() => {
    let soldCount = 0;
    let unsoldCount = 0;
    let topBuy = { name: "None", price: 0, team: "" };

    Object.entries(auctionData).forEach(([pid, data]) => {
      if (data.status === "sold") {
        soldCount++;
        if (data.finalBid > topBuy.price) {
          const playerObj = playersList.find((p) => p.id === pid);
          topBuy = {
            name: playerObj?.name || "Player",
            price: data.finalBid,
            team: data.soldTo?.split(" - ")[0] || "Team",
          };
        }
      } else if (data.status === "unsold") {
        unsoldCount++;
      }
    });

    return { soldCount, unsoldCount, topBuy };
  }, [auctionData, playersList]);

  return (
    <div className="w-full bg-gradient-to-r from-[#05110c] via-[#091f16] to-[#05110c] border-b border-[#d4be8c]/25 py-2 px-6 select-none font-mono text-xs text-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-[#040c08] px-2.5 py-1 rounded-lg border border-[#34d399]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-bold text-[#ecdcb8] uppercase tracking-wider text-[11px]">LIVE DRAFT FLOOR</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50">SOLD:</span>
            <strong className="text-[#34d399] bg-[#040c08] px-2 py-0.5 rounded-md border border-white/10 font-mono shadow-xs">{stats.soldCount}</strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/50">UNSOLD:</span>
            <strong className="text-rose-400 bg-[#040c08] px-2 py-0.5 rounded-md border border-rose-500/20 font-mono shadow-xs">{stats.unsoldCount}</strong>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] text-[#d4be8c] font-bold">RECORD LOT:</span>
            <strong className="text-white bg-[#040c08] px-2.5 py-0.5 rounded-md border border-[#d4be8c]/30 shadow-xs font-bold">
              {stats.topBuy.price > 0
                ? `${stats.topBuy.name} (`
                : "None yet"}
              {stats.topBuy.price > 0 && (
                <span className="text-[#34d399]">{formatLakhsAndCrores(stats.topBuy.price, true)}</span>
              )}
              {stats.topBuy.price > 0 && (
                <span className="text-[#d4be8c]"> • {stats.topBuy.team})</span>
              )}
            </strong>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-white/50">
          <span>BROADCAST SYNC:</span>
          <span className="text-[#34d399] font-bold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#34d399] animate-ping" />
            REALTIME
          </span>
        </div>
      </div>
    </div>
  );
}
