"use client";

import { useMemo } from "react";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";
import { TrophyIcon } from "@/components/AuctionIcons";

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
    <div className="w-full bg-gradient-to-r from-[#eaf4ed] via-[#f3f9f5] to-[#eaf4ed] border-b border-[#cfe0d5] py-2 px-6 select-none font-sans text-xs text-[#284938] shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-[#badbc6] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse shadow-[0_0_8px_#059669]" />
            <span className="font-bold text-[#0f5132] uppercase tracking-wider text-[11px]">LIVE DRAFT FLOOR</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#5c7567]">SOLD:</span>
            <strong className="text-[#047857] bg-white px-2 py-0.5 rounded-md border border-[#badbc6] font-mono shadow-xs">{stats.soldCount}</strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#5c7567]">UNSOLD:</span>
            <strong className="text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 font-mono shadow-xs">{stats.unsoldCount}</strong>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] text-[#854d0e] font-bold flex items-center gap-1">
              <TrophyIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>RECORD LOT:</span>
            </span>
            <strong className="text-[#0e2c1e] bg-white px-2.5 py-0.5 rounded-md border border-[#e5d4a6] shadow-xs font-semibold">
              {stats.topBuy.price > 0
                ? `${stats.topBuy.name} (`
                : "None yet"}
              {stats.topBuy.price > 0 && (
                <span className="text-[#047857] font-mono font-bold">{formatLakhsAndCrores(stats.topBuy.price, true)}</span>
              )}
              {stats.topBuy.price > 0 && (
                <span className="text-[#854d0e]"> • {stats.topBuy.team})</span>
              )}
            </strong>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#5c7567]">
          <span className="font-medium">BROADCAST SYNC:</span>
          <span className="text-[#047857] font-bold flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
            REALTIME
          </span>
        </div>
      </div>
    </div>
  );
}
