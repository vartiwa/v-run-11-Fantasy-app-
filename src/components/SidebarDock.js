"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";
import AudioVisualizer from "./AudioVisualizer";
import { formatLakhsAndCrores } from "@/lib/formatCurrency";

const oswald = Oswald({ subsets: ["latin"], weight: ["400", "700"] });

export default function SidebarDock({
  activeTab = "auction",
  setActiveTab,
  teamName = "",
  roomId = "MAIN-REALM",
  activeCount = 0,
  maxCapacity = 8,
  myBudget = 10000,
  isMuted = false,
  onToggleSound,
  onLeaveRoom,
  hasJoined = false,
  onOpenJoinModal,
}) {
  const [copied, setCopied] = useState(false);
  const franchiseName = teamName ? teamName.split(" - ")[0] : "Guest Manager";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/?room=${encodeURIComponent(roomId)}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <aside className="w-full md:w-64 bg-[#08090d] border-r border-white/10 flex flex-col justify-between p-5 select-none shrink-0">
      {/* Top Profile / Room Header */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A3E635] via-[#84CC16] to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.4)]">
            <span className="text-black font-black text-xl">⚡</span>
          </div>
          <div>
            <span className={`text-xl font-black text-white tracking-tight uppercase ${oswald.className}`}>
              DRAFT <span className="text-[#A3E635]">REALM</span>
            </span>
            <span className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.3em] block">
              V-RUN 11 Pro 2026
            </span>
          </div>
        </div>

        {/* Room Code & Share Invite Pill */}
        <div className="bg-[#121624] border border-white/10 rounded-2xl p-3 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
              Room Code
            </span>
            <span className="text-[9px] bg-sky-500/15 text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded font-black">
              {activeCount}/{maxCapacity} Managers
            </span>
          </div>

          <p className="font-mono font-black text-xs text-white uppercase tracking-wider truncate mb-2">
            {roomId}
          </p>

          <button
            onClick={handleCopyLink}
            className="w-full bg-[#1c2236] hover:bg-[#A3E635] text-slate-300 hover:text-black font-black text-[10px] py-1.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{copied ? "✓ Copied!" : "📋 Copy Invite Link"}</span>
          </button>
        </div>

        {/* Manager Profile Card */}
        <div className="bg-[#10121a] border border-white/10 rounded-2xl p-3.5 mb-6 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1c2233] to-[#121624] border border-white/15 flex items-center justify-center font-black text-sm text-[#A3E635] shadow-inner">
              {hasJoined ? franchiseName[0] : "👤"}
            </div>
            <div className="overflow-hidden">
              <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest block">
                {hasJoined ? "Franchise Lead" : "Status"}
              </span>
              <p className="font-black text-sm text-white truncate leading-tight">
                {franchiseName}
              </p>
              {hasJoined && (
                <span className="text-[10px] text-[#A3E635] font-bold">
                  {formatLakhsAndCrores(myBudget, true)} Purse
                </span>
              )}
            </div>
          </div>

          {!hasJoined && (
            <button
              onClick={onOpenJoinModal}
              className="w-full mt-3 bg-[#A3E635] hover:bg-[#bef264] text-black font-black text-xs py-2 rounded-xl uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(163,230,53,0.3)]"
            >
              Join This Room →
            </button>
          )}
        </div>

        {/* Primary Navigation Menu */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] px-2 mb-2 block">
            Navigation
          </span>

          <button
            onClick={() => setActiveTab("auction")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "auction"
                ? "bg-[#151927] text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🏟️</span>
              <span>Draft Room</span>
            </div>
            {activeTab === "auction" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#a3e635]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("squad")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "squad"
                ? "bg-[#151927] text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">🏏</span>
              <span>Playing XI Formation</span>
            </div>
            {activeTab === "squad" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#a3e635]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "chat"
                ? "bg-[#151927] text-[#A3E635] border border-[#A3E635]/40 shadow-[0_0_15px_rgba(163,230,53,0.15)]"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm">💬</span>
              <span>Live Room Banter</span>
            </div>
            {activeTab === "chat" && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] shadow-[0_0_8px_#a3e635]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <AudioVisualizer isMuted={isMuted} onToggle={onToggleSound} />
          {hasJoined && (
            <button
              onClick={onLeaveRoom}
              className="text-[10px] text-slate-400 hover:text-red-400 uppercase font-black tracking-widest px-3 py-2 rounded-xl bg-[#12141c] hover:bg-red-500/10 border border-white/10 transition-colors"
            >
              Exit ⎋
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 font-mono">
          <span>MAX 8 PLAYERS</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
