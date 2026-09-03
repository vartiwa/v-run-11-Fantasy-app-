"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

const CAPACITY_OPTIONS = [2, 4, 6, 8];

const QUICK_AUCTIONEER_NAMES = [
  "Auctioneer",
  "Commissioner",
  "Chief Auctioneer",
  "Richard Madley",
  "Mallika Sagar",
];

export default function PrivateRoomModal({
  isOpen,
  onClose,
  onJoinRoom,
  initialRoomId = "",
}) {
  const [capacity, setCapacity] = useState(4);
  const [roomId, setRoomId] = useState(() => {
    if (initialRoomId && initialRoomId !== "MAIN-ARENA") return initialRoomId;
    return `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`;
  });
  const [managerName, setManagerName] = useState("Auctioneer");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !managerName.trim()) return;

    // The host is strictly the neutral auctioneer (no franchise slot occupied)
    onJoinRoom({
      roomId: roomId.trim().toUpperCase(),
      managerName: managerName.trim(),
      franchise: "Auctioneer",
      capacity,
      isNeutralAuctioneer: true,
    });
  };

  const handleGenerateRandomRoom = () => {
    const code = `DRAFT-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomId(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-gradient-to-b from-white via-[#fcfbf9] to-[#f8f6f0] rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#dcd6c8] relative max-h-[90vh] overflow-y-auto text-[#121417]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8c8577] hover:text-[#121417] text-lg font-bold cursor-pointer w-8 h-8 rounded-full flex items-center justify-center bg-[#f5f2e9] border border-[#dfd9cb]"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 bg-[#f5f2e9] border border-[#dfd9cb] px-3 py-1 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] text-[10px] uppercase font-mono font-bold text-[#124032] tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#124032] animate-pulse" />
            <span>Auctioneer Dictator Desk • Supreme Room Authority</span>
          </div>

          <h3 className={`text-2xl md:text-3xl font-bold text-[#121417] uppercase tracking-tight ${oswald.className}`}>
            Host Auction Draft Room
          </h3>

          <div className="mt-2 bg-[#f0f7f3] border border-[#b8dfc9] rounded-2xl p-3 text-xs text-[#124032] font-mono leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-0.5">
              <span>🔨</span>
              <span>Host Rule: You are the dedicated Auctioneer</span>
            </p>
            <p className="text-[11px] text-[#235845]">
              As Host, you do not take a team. You dictate the auction, nominate lots, extend the clock, and strike the gavel. All franchise teams are 100% reserved for the bidders who join!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. CAPACITY OF BIDDING TEAMS */}
          <div>
            <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
              1. How many franchise teams will bid?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CAPACITY_OPTIONS.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setCapacity(cap)}
                  className={`py-2.5 rounded-2xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    capacity === cap
                      ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                      : "bg-white text-[#121417] border-[#d8d1c0] hover:bg-[#f4f1e8]"
                  }`}
                >
                  {cap} Teams
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#8c8577] font-mono mt-1">
              Bidders will pick teams like Mumbai, Chennai, Bengaluru, Kolkata, etc.
            </p>
          </div>

          {/* 2. ROOM PIN CODE */}
          <div>
            <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
              2. Room Code (Private PIN)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase().replace(/\s+/g, "-"))}
                placeholder="e.g. DRAFT-4821"
                className="flex-1 bg-white text-[#121417] font-mono font-bold text-sm px-4 py-2.5 rounded-2xl border border-[#d8d1c0] focus:outline-none focus:border-[#124032] shadow-2xs"
                required
              />
              <button
                type="button"
                onClick={handleGenerateRandomRoom}
                className="px-3.5 py-2.5 bg-white hover:bg-[#f4f1e8] text-[#124032] border border-[#d8d1c0] text-xs font-mono font-bold rounded-2xl transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Generate fresh unique room code"
              >
                🔄 New Code
              </button>
            </div>
          </div>

          {/* 3. AUCTIONEER NAME + PRESETS */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider">
                3. Your Auctioneer Name
              </label>
              <span className="text-[10px] text-[#8c8577] font-mono">
                Dictates the gavel & lots
              </span>
            </div>

            <input
              type="text"
              placeholder="e.g. Auctioneer / Commissioner"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-white text-[#121417] text-xs px-4 py-3 rounded-2xl border border-[#d8d1c0] focus:outline-none focus:border-[#124032] shadow-2xs font-mono font-semibold"
              required
            />

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-[#8c8577] self-center mr-1">Quick:</span>
              {QUICK_AUCTIONEER_NAMES.map((quickName) => (
                <button
                  key={quickName}
                  type="button"
                  onClick={() => setManagerName(quickName)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold border transition-all cursor-pointer ${
                    managerName === quickName
                      ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                      : "bg-white hover:bg-[#f4f1e8] text-[#121417] border-[#d8d1c0]"
                  }`}
                >
                  {quickName}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!roomId.trim() || !managerName.trim()}
            className="w-full bg-gradient-to-b from-[#185341] to-[#0e3328] hover:to-[#09241c] disabled:opacity-40 text-white font-mono font-bold text-xs py-3.5 rounded-2xl uppercase tracking-wider transition-all border border-[#1b5e4a] border-b-4 border-b-[#071c15] shadow-md active:translate-y-1 active:border-b-0 mt-3 cursor-pointer"
          >
            🔨 Open Auction Floor as Supreme Auctioneer ({capacity} Bidding Teams) →
          </button>
        </form>
      </div>
    </div>
  );
}
