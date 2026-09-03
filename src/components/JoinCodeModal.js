"use client";

import { useState, useEffect } from "react";
import { Oswald } from "next/font/google";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

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
    const unsub = onValue(teamRef, (snap) => {
      if (snap.exists()) {
        setLiveTeams(snap.val());
      } else {
        setLiveTeams({});
      }
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">
              2-Hour Auto-Release Protection
            </span>
          </div>
          <h3 className={`text-2xl font-bold text-[#124032] uppercase ${oswald.className}`}>
            Join Existing Room
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter the room code shared by your friend to select your franchise.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
              Room Code
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.toUpperCase().replace(/\s+/g, "-"));
                setSelectedFranchise("");
              }}
              placeholder="e.g. DRAFT-4821"
              className="w-full bg-slate-50 text-[#121417] font-mono font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#124032]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Select Available Franchise
              </label>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">
                Inactive claims expire in 2h
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {FRANCHISE_PRESETS.map((franchise) => {
                const existingTeamEntry = Object.entries(currentTeams).find(
                  ([teamKey]) => getFranchiseName(teamKey) === franchise.name
                );

                let isClaimActive = false;
                let remainingMin = 0;

                if (existingTeamEntry) {
                  const teamData = existingTeamEntry[1] || {};
                  const lastActive = teamData.lastActiveAt || teamData.joinedAt || 0;
                  const elapsedMs = Date.now() - lastActive;

                  if (elapsedMs < TWO_HOURS_MS) {
                    isClaimActive = true;
                    remainingMin = Math.max(1, Math.ceil((TWO_HOURS_MS - elapsedMs) / 60000));
                  } else {
                    isClaimActive = false; // Expired!
                  }
                }

                const isSelected = selectedFranchise === franchise.name;

                return (
                  <button
                    key={franchise.name}
                    type="button"
                    onClick={() => setSelectedFranchise(franchise.name)}
                    className={`p-2.5 rounded-xl text-xs font-bold flex flex-col justify-between border transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-[#124032] text-white border-[#124032] shadow-xs"
                        : "bg-slate-50 text-slate-800 border-slate-200 hover:border-[#124032]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{franchise.emoji} {franchise.name}</span>
                      {isSelected && <span className="text-[9px] font-black uppercase">✓</span>}
                    </div>

                    <div className="mt-1 flex items-center justify-between w-full text-[9px] font-mono">
                      {isClaimActive ? (
                        <span className="text-[#124032] font-bold">READY • TAP TO REJOIN</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">AVAILABLE</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Your Manager Name
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Pick quick name or type
              </span>
            </div>

            <input
              type="text"
              placeholder="e.g. Bidder 1 or Rahul"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#124032]"
              required
            />

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] font-mono text-slate-400 self-center mr-1">Quick:</span>
              {["Bidder 1", "Bidder 2", "Bidder 3", "Bidder 4", "Bidder 5", "Bidder 6"].map((quickName) => (
                <button
                  key={quickName}
                  type="button"
                  onClick={() => setManagerName(quickName)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border transition-all cursor-pointer ${
                    managerName === quickName
                      ? "bg-[#124032] text-white border-[#124032]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
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
            className="w-full bg-[#124032] hover:bg-[#0c2f24] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-xs mt-2 cursor-pointer disabled:cursor-not-allowed"
          >
            Enter Room →
          </button>
        </form>
      </div>
    </div>
  );
}
