"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });

const CAPACITY_OPTIONS = [2, 4, 6, 8];

const FRANCHISE_PRESETS = [
  { name: "Mumbai Titans", emoji: "🏏" },
  { name: "Chennai Super Kings", emoji: "🦁" },
  { name: "Royal Bengaluru", emoji: "👑" },
  { name: "Kolkata Knights", emoji: "⚔️" },
  { name: "Delhi Capitals", emoji: "🦅" },
  { name: "Gujarat Power", emoji: "⚡" },
  { name: "Rajasthan Warriors", emoji: "🐘" },
  { name: "Hyderabad Sun", emoji: "☀️" },
];

const QUICK_AUCTIONEER_NAMES = [
  "Auctioneer",
  "Commissioner",
  "Chief Auctioneer",
  "Richard Madley",
  "Mallika Sagar",
];

const QUICK_BIDDER_NAMES = ["Bidder 1", "Bidder 2", "Bidder 3", "Bidder 4", "Bidder 5", "Bidder 6"];

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
  const [isNeutralAuctioneer, setIsNeutralAuctioneer] = useState(true);
  const [selectedFranchise, setSelectedFranchise] = useState("Mumbai Titans");
  const [allowPlayerHammer, setAllowPlayerHammer] = useState(true);
  const [managerName, setManagerName] = useState("Auctioneer");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !managerName.trim()) return;
    if (!isNeutralAuctioneer && !selectedFranchise) return;

    onJoinRoom({
      roomId: roomId.trim().toUpperCase(),
      managerName: managerName.trim(),
      franchise: isNeutralAuctioneer ? "Auctioneer" : selectedFranchise,
      capacity,
      isNeutralAuctioneer,
      allowPlayerHammer,
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
            <span>Auction Room Setup • Supreme Gavel Authority</span>
          </div>

          <h3 className={`text-2xl md:text-3xl font-bold text-[#121417] uppercase tracking-tight ${oswald.className}`}>
            Host Auction Draft Room
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. ROLE SELECTION (Option to NOT be neutral auctioneer) */}
          <div>
            <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
              1. Your Role in the Room
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsNeutralAuctioneer(true);
                  if (!managerName || managerName.startsWith("Bidder")) setManagerName("Auctioneer");
                }}
                className={`p-3 rounded-2xl text-xs font-mono font-bold border transition-all text-left cursor-pointer flex flex-col justify-between ${
                  isNeutralAuctioneer
                    ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                    : "bg-white text-[#121417] border-[#d8d1c0] hover:bg-[#f4f1e8]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>🔨</span>
                  <span>Neutral Auctioneer</span>
                </div>
                <span className={`text-[10px] mt-1 font-normal ${isNeutralAuctioneer ? "text-emerald-100" : "text-[#767c84]"}`}>
                  No franchise. Purely dictate lots & strike gavel.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNeutralAuctioneer(false);
                  if (managerName === "Auctioneer") setManagerName("Bidder 1");
                }}
                className={`p-3 rounded-2xl text-xs font-mono font-bold border transition-all text-left cursor-pointer flex flex-col justify-between ${
                  !isNeutralAuctioneer
                    ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                    : "bg-white text-[#121417] border-[#d8d1c0] hover:bg-[#f4f1e8]"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>🏏</span>
                  <span>Player & Host (With Gavel)</span>
                </div>
                <span className={`text-[10px] mt-1 font-normal ${!isNeutralAuctioneer ? "text-emerald-100" : "text-[#767c84]"}`}>
                  Own a franchise, bid for players AND strike gavel!
                </span>
              </button>
            </div>
          </div>

          {/* 2. CHOOSE FRANCHISE (IF PLAYING HOST) */}
          {!isNeutralAuctioneer && (
            <div>
              <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
                2. Choose Your Franchise
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FRANCHISE_PRESETS.map((franchise) => {
                  const isSelected = selectedFranchise === franchise.name;
                  return (
                    <button
                      key={franchise.name}
                      type="button"
                      onClick={() => setSelectedFranchise(franchise.name)}
                      className={`p-2.5 rounded-2xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                          : "bg-white text-[#121417] border-[#d8d1c0] hover:bg-[#f4f1e8]"
                      }`}
                    >
                      <span className="truncate">{franchise.emoji} {franchise.name}</span>
                      {isSelected && <span className="text-[10px] font-black uppercase">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CAPACITY OF BIDDING TEAMS */}
          <div>
            <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
              {isNeutralAuctioneer ? "2. How many franchise teams will bid?" : "3. Room Capacity"}
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
          </div>

          {/* 4. ROOM PIN CODE */}
          <div>
            <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider block mb-1.5">
              {isNeutralAuctioneer ? "3. Room Code (Private PIN)" : "4. Room Code"}
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

          {/* 5. MANAGER / AUCTIONEER NAME + PRESETS */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono font-bold text-[#555a60] uppercase tracking-wider">
                {isNeutralAuctioneer ? "4. Your Auctioneer Name" : "5. Your Manager Name"}
              </label>
              <span className="text-[10px] text-[#8c8577] font-mono">
                {isNeutralAuctioneer ? "Dictates gavel & lots" : "Appears on team squad"}
              </span>
            </div>

            <input
              type="text"
              placeholder={isNeutralAuctioneer ? "e.g. Auctioneer / Commissioner" : "e.g. Bidder 1 or Rahul"}
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-white text-[#121417] text-xs px-4 py-3 rounded-2xl border border-[#d8d1c0] focus:outline-none focus:border-[#124032] shadow-2xs font-mono font-semibold"
              required
            />

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-[#8c8577] self-center mr-1">Quick:</span>
              {(isNeutralAuctioneer ? QUICK_AUCTIONEER_NAMES : QUICK_BIDDER_NAMES).map((quickName) => (
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

          {/* 6. ALLOW PLAYERS TO USE HAMMER CHECKBOX */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 bg-[#faf8f2] border border-[#dcd6c8] p-3 rounded-2xl cursor-pointer hover:bg-[#f5f1e6] transition-colors">
              <input
                type="checkbox"
                checked={allowPlayerHammer}
                onChange={(e) => setAllowPlayerHammer(e.target.checked)}
                className="w-4 h-4 text-[#124032] accent-[#124032] rounded cursor-pointer"
              />
              <div>
                <span className="text-xs font-mono font-bold text-[#121417] block">
                  Allow any player to strike the hammer (Open Gavel)
                </span>
                <span className="text-[10px] font-mono text-[#767c84] block">
                  If enabled, players can also click Hammer Down or Pass when bidding concludes
                </span>
              </div>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!roomId.trim() || !managerName.trim() || (!isNeutralAuctioneer && !selectedFranchise)}
            className="w-full bg-gradient-to-b from-[#185341] to-[#0e3328] hover:to-[#09241c] disabled:opacity-40 text-white font-mono font-bold text-xs py-3.5 rounded-2xl uppercase tracking-wider transition-all border border-[#1b5e4a] border-b-4 border-b-[#071c15] shadow-md active:translate-y-1 active:border-b-0 mt-3 cursor-pointer"
          >
            {isNeutralAuctioneer
              ? `🔨 Open Auction Floor as Auctioneer (${capacity} Teams) →`
              : `🏏 Open Draft Floor as Playing Host (${selectedFranchise}) →`}
          </button>
        </form>
      </div>
    </div>
  );
}
