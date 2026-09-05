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
    <div className="relative bg-gradient-to-b from-[#183d2f] via-[#133226] to-[#0e271e] rounded-3xl border border-[#3dd9a5]/35 overflow-hidden shadow-[0_16px_36px_rgba(0,0,0,0.4),0_0_30px_rgba(46,133,101,0.2),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-[#d4be8c]/25 flex flex-col select-none text-white">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/50 to-transparent pointer-events-none" />

      <div className="bg-[#10271f] px-4 py-2.5 border-b border-white/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3dd9a5] animate-pulse shadow-[0_0_8px_#3dd9a5]" />
          <span className={`text-xs font-bold uppercase tracking-wider text-[#ebd7aa] ${oswald.className}`}>
            Live Auction Ledger
          </span>
        </div>
        <span className="text-[10px] text-white/70 font-mono bg-[#0d221a] px-2 py-0.5 rounded-md border border-[#3dd9a5]/25 shadow-xs">
          {logs.length} transactions
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-28 overflow-y-auto p-3 space-y-1 divide-y divide-white/5 bg-[#0e241c]/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]"
      >
        {logs.length === 0 ? (
          <div className="py-4 text-center text-white/50 text-xs font-mono italic">
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
                      ? "text-[#3dd9a5] font-black"
                      : isUnsold
                      ? "text-rose-400 font-black"
                      : "text-[#ebd7aa] font-semibold"
                  }`}>
                    {item.message}
                  </p>
                </div>
                <span className="text-[10px] text-white/50 whitespace-nowrap font-mono shrink-0 bg-[#10271f] px-1.5 py-0.5 rounded border border-white/10">
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
