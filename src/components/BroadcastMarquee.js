"use client";

import { useMemo } from "react";

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
    <div className="w-full bg-gradient-to-r from-[#f4f1e8] via-[#ebe7dc] to-[#f4f1e8] border-b border-[#dcd6c8] py-2 px-6 select-none font-mono text-xs text-[#555a60] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-[#ded8cb] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#124032] animate-pulse" />
            <span className="font-bold text-[#121417] uppercase tracking-wider text-[11px]">LIVE DRAFT FLOOR</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#767c84]">SOLD:</span>
            <strong className="text-[#121417] bg-white px-2 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">{stats.soldCount}</strong>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#767c84]">UNSOLD:</span>
            <strong className="text-rose-700 bg-white px-2 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">{stats.unsoldCount}</strong>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] text-[#767c84]">RECORD LOT:</span>
            <strong className="text-[#124032] bg-white px-2.5 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs font-bold">
              {stats.topBuy.price > 0
                ? `${stats.topBuy.name} (₹${(stats.topBuy.price / 100).toFixed(2)} Cr • ${stats.topBuy.team})`
                : "None yet"}
            </strong>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#767c84] font-semibold">
          <span className="bg-[#f0ece0] px-2 py-0.5 rounded border border-[#dfd9cb]">Gavel: 60s</span>
          <span>•</span>
          <span className="bg-[#f0ece0] px-2 py-0.5 rounded border border-[#dfd9cb]">Anti-Sniping +15s</span>
        </div>
      </div>
    </div>
  );
}
