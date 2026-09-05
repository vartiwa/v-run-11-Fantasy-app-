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
    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-[#cfe0d5] overflow-hidden shadow-2xs flex flex-col select-none text-[#12241b]">
      <div className="bg-[#f2f7f4] px-3.5 py-2 border-b border-[#e4eee6] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          <span className={`text-[11px] font-bold uppercase tracking-wider text-[#0f5132] ${outfit.className}`}>
            Live Ledger Feed
          </span>
        </div>
        <span className="text-[10px] text-[#5c7567] bg-white px-2 py-0.5 rounded-md border border-[#d6e6dc] font-mono">
          {logs.length} logged
        </span>
      </div>

      <div
        ref={scrollRef}
        className="max-h-24 overflow-y-auto p-2.5 space-y-1 divide-y divide-[#edf3ef] bg-[#fafcfb]"
      >
        {logs.length === 0 ? (
          <div className="py-2.5 text-center text-[#7d9b89] text-xs font-sans italic">
            Waiting for opening bid to be recorded in ledger...
          </div>
        ) : (
          logs.map((item) => {
            const isSold = item.type === "sold";
            const isUnsold = item.type === "unsold";

            return (
              <div
                key={item.id || item.timestamp}
                className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs"
              >
                <p className={`truncate text-xs font-sans ${
                  isSold
                    ? "text-[#047857] font-bold"
                    : isUnsold
                    ? "text-rose-700 font-bold"
                    : "text-[#0e2c1e] font-medium"
                }`}>
                  {item.message}
                </p>
                <span className="text-[10px] text-[#5c7567] whitespace-nowrap font-mono shrink-0 bg-white px-1.5 py-0.2 rounded border border-[#e2ece5]">
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
