"use client";

import { useState, useEffect } from "react";

const FALLBACK_MATCHES = [
  {
    id: "fb-1",
    name: "IPL 2026: Mumbai Indians vs Chennai Super Kings",
    status: "MI need 24 runs in 14 balls",
    score: [
      { inning: "CSK", r: 198, w: 5, o: 20 },
      { inning: "MI", r: 175, w: 4, o: 17.4 },
    ],
  },
  {
    id: "fb-2",
    name: "IPL 2026: Royal Challengers Bengaluru vs Kolkata Knight Riders",
    status: "RCB 1st Innings in progress",
    score: [{ inning: "RCB", r: 142, w: 3, o: 15.2 }],
  },
];

export default function LiveScoreTicker() {
  const [matches, setMatches] = useState(FALLBACK_MATCHES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchScores = async () => {
      try {
        const res = await fetch("/api/live-scores");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.matches && data.matches.length > 0) {
            setMatches(data.matches);
          }
        }
      } catch {
        // Keep fallback simulation
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScores();
    const interval = setInterval(fetchScores, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-[#111] px-5 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#EF4123] rounded-full animate-pulse shadow-[0_0_8px_#EF4123]"></span>
          <h4 className="text-white font-black uppercase tracking-widest text-xs">Live Match Center</h4>
        </div>
        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          {loading ? "Updating..." : "LIVE"}
        </span>
      </div>

      <div className="divide-y divide-white/5 max-h-52 overflow-y-auto">
        {matches.map((m) => (
          <div key={m.id} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1 truncate font-semibold">
              {m.name}
            </p>
            <div className="space-y-0.5">
              {m.score?.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-slate-200 font-bold">
                  <span>{s.inning}</span>
                  <span>
                    <span className="text-[#EF4123] font-black">{s.r}/{s.w}</span>
                    <span className="text-slate-400 text-[10px] ml-1 font-normal">({s.o} ov)</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate italic font-medium">{m.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}