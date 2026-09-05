"use client";

import { useEffect, useRef } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"] });

export default function ActivityFeed({ logs = [] }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="relative bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] rounded-3xl border border-[#c6ded0] overflow-hidden shadow-[0_16px_36px_rgba(18,64,50,0.08),0_2px_8px_rgba(18,64,50,0.04)] ring-1 ring-[#059669]/10 flex flex-col select-none text-[#12241b]">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      <div className="bg-[#eef5f1] px-4 py-2.5 border-b border-[#cfe0d5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse shadow-[0_0_8px_#059669]" />
          <span className={`text-xs font-bold uppercase tracking-wider text-[#0f5132] ${outfit.className}`}>
            Live Auction Ledger
          </span>
        </div>
        <span className="text-[10px] text-[#5c7567] font-mono bg-white px-2 py-0.5 rounded-md border border-[#cbe0d3] shadow-xs">
          {logs.length} transactions
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-28 overflow-y-auto p-3 space-y-1 divide-y divide-[#e2ede5] bg-[#f8faf8] shadow-inner"
      >
        {logs.length === 0 ? (
          <div className="py-4 text-center text-[#5c7567] text-xs font-mono italic">
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
                      ? "text-[#047857] font-black"
                      : isUnsold
                      ? "text-rose-700 font-black"
                      : "text-[#0e2c1e] font-semibold"
                  }`}>
                    {item.message}
                  </p>
                </div>
                <span className="text-[10px] text-[#5c7567] whitespace-nowrap font-mono shrink-0 bg-white px-1.5 py-0.5 rounded border border-[#cfe2d6]">
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
