"use client";

import { useState, useEffect } from "react";
import { Oswald, Inter } from "next/font/google";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import {
  KeyRound,
  ShieldCheck,
  X,
  Check,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 Hours TTL

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

const getFranchiseName = (uniqueTeamId = "") => uniqueTeamId.split(" - ")[0];

export default function JoinCodeModal({
  isOpen,
  onClose,
  onJoinRoom,
  allTeams: fallbackTeams = {},
  initialRoomId = "",
}) {
  const [roomId, setRoomId] = useState(initialRoomId || "");
  const [managerName, setManagerName] = useState("");
  const [selectedFranchise, setSelectedFranchise] = useState("");
  const [liveTeams, setLiveTeams] = useState({});

  // Listen to the specific room's teams in real-time
  useEffect(() => {
    if (!roomId.trim() || !isOpen) return;
    const cleanRoom = roomId.trim().toUpperCase();
    const teamRef = ref(db, `rooms/${cleanRoom}/teams`);
    const unsub = onValue(
      teamRef,
      (snap) => {
        if (snap.exists()) {
          setLiveTeams(snap.val());
        } else {
          setLiveTeams({});
        }
      },
      (err) => {
        console.warn("JoinCodeModal teams listener notice:", err);
      }
    );
    return () => unsub();
  }, [roomId, isOpen]);

  if (!isOpen) return null;

  const currentTeams = Object.keys(liveTeams).length > 0 ? liveTeams : fallbackTeams;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim() || !managerName.trim() || !selectedFranchise) return;
    onJoinRoom({
      roomId: roomId.trim().toUpperCase(),
      managerName: managerName.trim(),
      franchise: selectedFranchise,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md bg-gradient-to-b from-[#183d2f] via-[#133226] to-[#0e271e] border border-[#3dd9a5]/35 shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_60px_rgba(46,133,101,0.3)] rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto text-white selection:bg-[#d4be8c] selection:text-black ${inter.className}`}>
        
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

        {/* Header */}
        <div className="relative z-10 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124032]/80 border border-[#d4be8c]/35 text-[#d4be8c] text-[11px] font-mono tracking-wider uppercase backdrop-blur-md mb-2.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#34d399]" />
            <span>2-Hour Auto-Release Protection</span>
          </div>

          <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white ${oswald.className}`}>
            Join Existing Room
          </h3>
          <p className="text-xs text-white/60 mt-1">
            Enter the PIN code shared by your host to claim your franchise.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          
          {/* Room Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#d4be8c]" />
              <span>Room PIN Code</span>
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.toUpperCase().replace(/\s+/g, "-"));
                setSelectedFranchise("");
              }}
              placeholder="e.g. DRAFT-4821"
              className="w-full bg-white/5 text-white font-mono font-bold text-sm px-4 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#d4be8c] focus:ring-1 focus:ring-[#d4be8c]/40 tracking-wider placeholder-white/30 shadow-inner"
              required
            />
          </div>

          {/* Franchise Selection */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Select Available Franchise
              </label>
              <span className="text-[10px] font-mono text-[#d4be8c] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Live Status</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRANCHISE_PRESETS.map((franchise) => {
                const existingTeamEntry = Object.entries(currentTeams).find(
                  ([teamKey]) => getFranchiseName(teamKey) === franchise.name
                );

                let isClaimActive = false;
                if (existingTeamEntry) {
                  const teamData = existingTeamEntry[1] || {};
                  const lastActive = teamData.lastActiveAt || teamData.joinedAt || 0;
                  const elapsedMs = Date.now() - lastActive;

                  if (elapsedMs < TWO_HOURS_MS) {
                    isClaimActive = true;
                  }
                }

                const isSelected = selectedFranchise === franchise.name;

                return (
                  <button
                    key={franchise.name}
                    type="button"
                    onClick={() => setSelectedFranchise(franchise.name)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex flex-col justify-between border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#124032] text-white border-[#d4be8c]/60 ring-1 ring-[#d4be8c]/40 shadow-[0_4px_12px_rgba(18,64,50,0.3)]"
                        : "bg-white/5 hover:bg-white/10 text-white/80 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{franchise.emoji} {franchise.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#d4be8c] shrink-0" />}
                    </div>

                    <div className="mt-1 flex items-center justify-between w-full text-[10px] font-mono">
                      {isClaimActive ? (
                        <span className="text-[#d4be8c] font-bold">IN PLAY • REJOIN</span>
                      ) : (
                        <span className="text-[#34d399] font-medium">AVAILABLE</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manager Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/70">
                Your Manager Name
              </label>
              <span className="text-[11px] text-white/40">
                Pick quick name or type
              </span>
            </div>

            <input
              type="text"
              placeholder="e.g. Bidder 1 or Rahul"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-white/5 text-white text-xs px-4 py-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#d4be8c] focus:ring-1 focus:ring-[#d4be8c]/40 placeholder-white/30 font-medium"
              required
            />

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[11px] text-white/40 self-center mr-1">Quick:</span>
              {["Bidder 1", "Bidder 2", "Bidder 3", "Bidder 4", "Bidder 5", "Bidder 6"].map((quickName) => (
                <button
                  key={quickName}
                  type="button"
                  onClick={() => setManagerName(quickName)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
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

          <button
            type="submit"
            disabled={!roomId.trim() || !managerName.trim() || !selectedFranchise}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4be8c] via-[#ecdcb8] to-[#d4be8c] hover:from-[#e2ce9f] hover:to-[#dfc896] disabled:opacity-40 text-[#071510] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_0_#9a8455,0_12px_28px_rgba(212,190,140,0.3)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center justify-center gap-2 mt-4 font-mono disabled:cursor-not-allowed"
          >
            <span>Enter Auction Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
