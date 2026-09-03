"use client";

import { useEffect, useRef } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

export default function ActivityFeed({ logs = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="relative bg-gradient-to-b from-white via-[#fdfcf9] to-[#f8f6f0] rounded-3xl border border-[#dcd6c8] overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.02),0_8px_20px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col select-none text-[#121417]">
      <div className="bg-[#f5f2e9] px-4 py-2.5 border-b border-[#e5dfd2] flex items-center justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#124032]" />
          <span className={`text-xs font-bold uppercase tracking-wider text-[#121417] ${oswald.className}`}>
            Live Auction Ledger
          </span>
        </div>
        <span className="text-[10px] text-[#767c84] font-mono bg-white px-2 py-0.5 rounded-md border border-[#ded8cb] shadow-2xs">
          {logs.length} transactions
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-28 overflow-y-auto p-3 space-y-1 divide-y divide-[#e8e2d4] bg-gradient-to-b from-[#faf8f2] to-[#f4f1e8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)]"
      >
        {logs.length === 0 ? (
          <div className="py-4 text-center text-[#8c8577] text-xs font-mono italic">
            Waiting for opening bid to be recorded in ledger...
          </div>
        ) : (
          logs.map((item) => {
            const isSold = item.type === "sold";
            const isUnsold = item.type === "unsold";

            return (
              <div
                key={item.id || item.timestamp}
                className="pt-1.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate min-w-0 font-mono">
                  <p className={`truncate text-xs ${
                    isSold
                      ? "text-[#124032] font-black"
                      : isUnsold
                      ? "text-rose-700 font-black"
                      : "text-[#121417] font-semibold"
                  }`}>
                    {item.message}
                  </p>
                </div>
                <span className="text-[10px] text-[#8c8577] whitespace-nowrap font-mono shrink-0 bg-white/80 px-1.5 py-0.5 rounded border border-[#e5dfd2]">
                  {item.time || "Just now"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
