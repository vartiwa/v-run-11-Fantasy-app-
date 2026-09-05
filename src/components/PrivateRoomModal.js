"use client";

import { useState } from "react";
import { Outfit, Inter } from "next/font/google";
import {
  Gavel,
  Trophy,
  Users,
  Shuffle,
  ShieldCheck,
  X,
  Check,
  ArrowRight,
  Crown,
} from "lucide-react";

const oswald = Outfit({ subsets: ["latin"], weight: ["500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

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

const QUICK_BIDDER_NAMES = [
  "Bidder 1",
  "Bidder 2",
  "Bidder 3",
  "Bidder 4",
  "Bidder 5",
  "Bidder 6",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg bg-gradient-to-b from-[#183d2f] via-[#133226] to-[#0e271e] border border-[#3dd9a5]/35 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(46,133,101,0.3)] rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-white selection:bg-[#d4be8c] selection:text-black ${inter.className}`}>
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#3dd9a5]/20 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 active:scale-95 shadow-sm"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="relative z-10 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124032]/80 border border-[#d4be8c]/35 text-[#d4be8c] text-[11px] font-mono tracking-wider uppercase backdrop-blur-md mb-2.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
            <span>Auction Room Setup • Gavel Authority</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white ${oswald.className}`}>
            Host Auction Draft Room
          </h3>
          <p className="text-xs text-white/60 mt-1">
            Configure your private war room, set franchise limits, and take the auctioneer gavel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          
          {/* 1. ROLE SELECTION */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-[#d4be8c]" />
              <span>Select Your Role</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsNeutralAuctioneer(true);
                  if (!managerName || managerName.startsWith("Bidder")) setManagerName("Auctioneer");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  isNeutralAuctioneer
                    ? "bg-gradient-to-br from-[#124032] to-[#0a231b] border-[#d4be8c]/60 shadow-[0_4px_20px_rgba(18,64,50,0.4)] ring-1 ring-[#d4be8c]/40"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#d4be8c]">
                    <Gavel className="w-4 h-4" />
                  </div>
                  {isNeutralAuctioneer && (
                    <span className="w-5 h-5 rounded-full bg-[#d4be8c] text-[#071510] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-white block">Neutral Auctioneer</span>
                <span className="text-[11px] text-white/60 leading-snug mt-1 block">
                  Pure authority. Dictate player lots and strike the gavel without owning a franchise.
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNeutralAuctioneer(false);
                  if (managerName === "Auctioneer") setManagerName("Bidder 1");
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  !isNeutralAuctioneer
                    ? "bg-gradient-to-br from-[#124032] to-[#0a231b] border-[#d4be8c]/60 shadow-[0_4px_20px_rgba(18,64,50,0.4)] ring-1 ring-[#d4be8c]/40"
                    : "bg-white/5 hover:bg-white/10 border-white/10 text-white/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#d4be8c]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  {!isNeutralAuctioneer && (
                    <span className="w-5 h-5 rounded-full bg-[#d4be8c] text-[#071510] flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-white block">Playing Host</span>
                <span className="text-[11px] text-white/60 leading-snug mt-1 block">
                  Bid for players, assemble your starting 11, AND control room gavel settings.
                </span>
              </button>
            </div>
          </div>

          {/* 2. CHOOSE FRANCHISE (IF PLAYING HOST) */}
          {!isNeutralAuctioneer && (
            <div className="space-y-2 pt-1 animate-in fade-in duration-200">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Choose Your Franchise
              </span>
              <div className="grid grid-cols-2 gap-2">
                {FRANCHISE_PRESETS.map((franchise) => {
                  const isSelected = selectedFranchise === franchise.name;
                  return (
                    <button
                      key={franchise.name}
                      type="button"
                      onClick={() => setSelectedFranchise(franchise.name)}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#124032] text-white border-[#d4be8c]/60 ring-1 ring-[#d4be8c]/30 shadow-sm"
                          : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                      }`}
                    >
                      <span className="truncate">{franchise.emoji} {franchise.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#d4be8c] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. CAPACITY OF BIDDING TEAMS */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#d4be8c]" />
              <span>Manager Table Size</span>
            </span>
            <div className="grid grid-cols-4 gap-2">
              {CAPACITY_OPTIONS.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => setCapacity(cap)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    capacity === cap
                      ? "bg-gradient-to-r from-[#d4be8c] to-[#c7ad72] text-[#06120d] border-[#d4be8c] shadow-[0_2px_12px_rgba(212,190,140,0.3)] font-mono"
                      : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10 font-mono"
                  }`}
                >
                  {cap} Teams
                </button>
              ))}
            </div>
          </div>

          {/* 4. ROOM PIN CODE */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Room PIN Code
            </span>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase().replace(/\s+/g, "-"))}
                  placeholder="e.g. DRAFT-4821"
                  className="w-full bg-white/5 text-white font-mono font-bold text-sm px-4 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#d4be8c] focus:ring-1 focus:ring-[#d4be8c]/40 tracking-wider placeholder-white/30 shadow-inner"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleGenerateRandomRoom}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono font-semibold rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95 shadow-sm"
                title="Generate fresh unique room code"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#d4be8c]" />
                <span>New Code</span>
              </button>
            </div>
          </div>

          {/* 5. MANAGER / AUCTIONEER NAME + PRESETS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
                {isNeutralAuctioneer ? "Your Auctioneer Identity" : "Your Manager Name"}
              </span>
              <span className="text-[11px] text-white/40">
                {isNeutralAuctioneer ? "Broadcasts gavel decisions" : "Displays on team squad"}
              </span>
            </div>

            <input
              type="text"
              placeholder={isNeutralAuctioneer ? "e.g. Auctioneer / Commissioner" : "e.g. Bidder 1 or Rahul"}
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-white/5 text-white text-xs px-4 py-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#d4be8c] focus:ring-1 focus:ring-[#d4be8c]/40 placeholder-white/30 font-medium"
              required
            />

            {/* Quick Presets Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-white/40 mr-1">Presets:</span>
              {(isNeutralAuctioneer ? QUICK_AUCTIONEER_NAMES : QUICK_BIDDER_NAMES).map((quickName) => (
                <button
                  key={quickName}
                  type="button"
                  onClick={() => setManagerName(quickName)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border ${
                    managerName === quickName
                      ? "bg-[#124032] text-[#d4be8c] border-[#d4be8c]/50 font-semibold shadow-xs"
                      : "bg-white/5 hover:bg-white/10 text-white/70 border-white/10"
                  }`}
                >
                  {quickName}
                </button>
              ))}
            </div>
          </div>

          {/* 6. ALLOW PLAYERS TO USE HAMMER CHECKBOX */}
          <label className="flex items-start gap-3 bg-white/5 hover:bg-white/8 border border-white/10 p-3.5 rounded-2xl cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={allowPlayerHammer}
              onChange={(e) => setAllowPlayerHammer(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-[#124032] rounded cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-white block">
                Open Gavel Mode (Allow all managers to strike hammer)
              </span>
              <span className="text-[11px] text-white/50 block mt-0.5 leading-snug">
                When enabled, any participant can confirm &apos;Sold&apos; or &apos;Unsold&apos; when bidding settles.
              </span>
            </div>
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!roomId.trim() || !managerName.trim() || (!isNeutralAuctioneer && !selectedFranchise)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4be8c] via-[#ecdcb8] to-[#d4be8c] hover:from-[#e2ce9f] hover:to-[#dfc896] text-[#071510] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_0_#9a8455,0_12px_28px_rgba(212,190,140,0.3)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2 mt-4 font-mono disabled:opacity-50"
          >
            <Gavel className="w-4 h-4" />
            <span>
              {isNeutralAuctioneer
                ? `Open War Room as Auctioneer (${capacity} Teams)`
                : `Open War Room as Playing Host (${selectedFranchise})`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
