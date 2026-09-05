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
    <div className="relative bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] rounded-3xl border border-[#d4be8c]/25 overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(212,190,140,0.15)] flex flex-col select-none text-white">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent pointer-events-none" />

      <div className="bg-[#06140e] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse shadow-[0_0_8px_#34d399]" />
          <span className={`text-xs font-bold uppercase tracking-wider text-[#ecdcb8] ${oswald.className}`}>
            Live Auction Ledger
          </span>
        </div>
        <span className="text-[10px] text-white/60 font-mono bg-[#040c08] px-2 py-0.5 rounded-md border border-white/10 shadow-xs">
          {logs.length} transactions
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-28 overflow-y-auto p-3 space-y-1 divide-y divide-white/5 bg-[#040c08]/80 shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)]"
      >
        {logs.length === 0 ? (
          <div className="py-4 text-center text-white/40 text-xs font-mono italic">
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
                      ? "text-[#34d399] font-black"
                      : isUnsold
                      ? "text-rose-400 font-black"
                      : "text-[#ecdcb8] font-semibold"
                  }`}>
                    {item.message}
                  </p>
                </div>
                <span className="text-[10px] text-white/40 whitespace-nowrap font-mono shrink-0 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
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
