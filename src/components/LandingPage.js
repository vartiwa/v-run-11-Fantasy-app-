"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Inter, Oswald } from "next/font/google";
import {
  ArrowRight,
  Lock,
  Volume2,
  VolumeX,
} from "lucide-react";
import { sounds } from "@/lib/soundEffects";

const displayFont = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"] });
const bodyFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// 🌟 KEY MARQUEE PLAYERS ONLY (MAIN PAGE SPOTLIGHT)
const KEY_PLAYERS = [
  {
    id: 1,
    name: "Virat Kohli",
    role: "Top-Order Batsman",
    team: "Bengaluru",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 98,
    stats: { matches: 252, runs: 8004, sr: 131.0, wickets: 4, economy: 8.8 },
    imageUrl: "/kohli.png",
  },
  {
    id: 4,
    name: "Jasprit Bumrah",
    role: "Death Overs Specialist",
    team: "Mumbai",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 99,
    stats: { matches: 133, runs: 65, sr: 95.0, wickets: 165, economy: 7.3 },
    imageUrl: "/bumrah.png",
  },
  {
    id: 2,
    name: "Rohit Sharma",
    role: "Opening Batsman",
    team: "Mumbai",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 96,
    stats: { matches: 257, runs: 6628, sr: 131.1, wickets: 15, economy: 7.9 },
    imageUrl: "/rohit.png",
  },
  {
    id: 3,
    name: "MS Dhoni",
    role: "Wicketkeeper Finisher",
    team: "Chennai",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 97,
    stats: { matches: 264, runs: 5243, sr: 137.5, dismissals: 190, economy: 0 },
    imageUrl: "/dhoni.svg",
  },
  {
    id: 5,
    name: "Hardik Pandya",
    role: "Pace All-Rounder",
    team: "Mumbai",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 95,
    stats: { matches: 137, runs: 2525, sr: 145.2, wickets: 64, economy: 8.9 },
    imageUrl: "/pandya.svg",
  },
  {
    id: 6,
    name: "Heinrich Klaasen",
    role: "Explosive Wicketkeeper",
    team: "Hyderabad",
    country: "SA",
    flag: "🇿🇦",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 95,
    stats: { matches: 35, runs: 993, sr: 168.3, wickets: 0, economy: 0 },
    imageUrl: "/klaasen.svg",
  },
  {
    id: 7,
    name: "Rashid Khan",
    role: "Leg-Spin Maestro",
    team: "Gujarat",
    country: "AFG",
    flag: "🇦🇫",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 96,
    stats: { matches: 121, runs: 545, sr: 138.0, wickets: 149, economy: 6.8 },
    imageUrl: "/rashid.svg",
  },
  {
    id: 8,
    name: "Ravindra Jadeja",
    role: "Spin All-Rounder",
    team: "Chennai",
    country: "IND",
    flag: "🇮🇳",
    basePrice: 200,
    reserve: "₹2.00 Cr",
    rating: 94,
    stats: { matches: 240, runs: 2959, sr: 128.6, wickets: 160, economy: 7.6 },
    imageUrl: "/jadeja.svg",
  },
];

const TEAMS = [
  { id: "csk", name: "Chennai", code: "CSK", purse: "100.00", titles: "5x Champions" },
  { id: "mi", name: "Mumbai", code: "MI", purse: "100.00", titles: "5x Champions" },
  { id: "rcb", name: "Bengaluru", code: "RCB", purse: "100.00", titles: "Fan Favorite" },
  { id: "kkr", name: "Kolkata", code: "KKR", purse: "100.00", titles: "3x Champions" },
  { id: "gt", name: "Gujarat", code: "GT", purse: "100.00", titles: "2022 Champs" },
  { id: "srh", name: "Hyderabad", code: "SRH", purse: "100.00", titles: "Orange Army" },
  { id: "dc", name: "Delhi", code: "DC", purse: "100.00", titles: "Nayi Dilli" },
  { id: "rr", name: "Rajasthan", code: "RR", purse: "100.00", titles: "Inaugural Champs" },
];

export default function LandingPage({
  onOpenPrivateModal,
  onOpenJoinCodeModal,
  onQuickJoin,
}) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(1);
  const [currentBid, setCurrentBid] = useState(1450); // in Lakhs (14.50 Cr)
  const [leader, setLeader] = useState("Royal Bengaluru");
  const [bidLog, setBidLog] = useState([
    { team: "Royal Bengaluru", amount: "₹14.50 CR", time: "Just now" },
    { team: "Mumbai", amount: "₹14.00 CR", time: "12s ago" },
    { team: "Chennai", amount: "₹13.50 CR", time: "24s ago" },
  ]);
  const [isPaddleRaised, setIsPaddleRaised] = useState(false);
  const [quickCode, setQuickCode] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activePlayer = useMemo(() => {
    return KEY_PLAYERS.find((p) => p.id === selectedPlayerId) || KEY_PLAYERS[0];
  }, [selectedPlayerId]);

  const handleRaisePaddle = () => {
    if (soundEnabled) sounds.bid();
    setIsPaddleRaised(true);
    setTimeout(() => setIsPaddleRaised(false), 250);

    const nextAmount = currentBid + 50;
    const formatted = `₹${(nextAmount / 100).toFixed(2)} CR`;
    setCurrentBid(nextAmount);
    setLeader("You (Chennai)");
    setBidLog((prev) => [
      { team: "You (Chennai)", amount: formatted, time: "Just now" },
      ...prev.slice(0, 3),
    ]);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayerId(player.id);
    const startBid = player.basePrice + 100;
    setCurrentBid(startBid);
    setLeader("Mumbai");
    setBidLog([
      { team: "Mumbai", amount: `₹${(startBid / 100).toFixed(2)} CR`, time: "Just now" },
      { team: "Reserve Price", amount: `₹${(player.basePrice / 100).toFixed(2)} CR`, time: "Opening" },
    ]);
  };

  return (
    <div className={`w-full min-h-screen bg-[#fcfbf9] text-[#121417] flex flex-col selection:bg-[#124032] selection:text-white ${bodyFont.className}`}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. MINIMAL EDITORIAL TOP BAR
          ───────────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-black/10 px-6 lg:px-12 py-4 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
          <span className={`text-xl font-bold tracking-tighter uppercase text-[#121417] ${displayFont.className}`}>
            V-RUN 11
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-[#555a60] uppercase tracking-wider pl-6 border-l border-black/10">
            IPL Mega Auction Simulator • ₹100 Cr Salary Cap
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border border-black/15 rounded-xl px-3 py-1.5 text-xs bg-[#faf8f4] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
            <span className="font-mono text-[11px] text-[#555a60] uppercase">ROOM:</span>
            <input
              type="text"
              maxLength={6}
              placeholder="CODE"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
              className="w-16 bg-transparent font-mono font-bold uppercase focus:outline-none text-[#121417]"
            />
            <button
              onClick={onOpenJoinCodeModal}
              className="text-[11px] font-bold uppercase tracking-wider text-[#124032] hover:underline cursor-pointer"
            >
              Join
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-[#555a60] hover:text-black rounded-xl border border-black/10 hover:border-black/20 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer active:scale-95"
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPrivateModal}
            className="px-5 py-2.5 rounded-xl bg-[#124032] hover:bg-[#0e3529] text-[#fcfbf9] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_2px_0_#071d15,0_4px_8px_rgba(18,64,50,0.18)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Host Draft</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. THE EDITORIAL HERO: MASSIVE TYPE + TACTILE PADDLE
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-black/10 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Pure Typographic Statement */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div className="text-xs font-mono tracking-widest text-[#124032] uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#124032]" />
              <span>Real-Time Multiplayer Auction for Friends</span>
            </div>

            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] text-[#121417] mb-6 ${displayFont.className}`}>
              The Cricket <br />
              Auction.
            </h1>

            <p className="text-base sm:text-lg text-[#454a50] leading-relaxed max-w-xl mb-8 font-normal">
              ₹100 Crore purse. Official IPL rules. Anti-sniping gavel clock. Field your 11-player squad on the 2D pitch. Zero app downloads, zero logins.
            </p>

            {/* Clear, Tactile Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenPrivateModal}
                className="px-8 py-4 rounded-xl bg-[#124032] hover:bg-[#0e3529] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_0_#071d15,0_10px_20px_rgba(18,64,50,0.22)] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-2"
              >
                <span>Create Private Draft Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onQuickJoin}
                className="px-6 py-4 rounded-xl border border-black/15 hover:border-black/30 text-[#121417] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_2px_4px_rgba(0,0,0,0.03),0_6px_14px_rgba(0,0,0,0.03)] hover:shadow-md bg-white cursor-pointer active:translate-y-0.5"
              >
                Instant Demo Table
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 w-full flex flex-wrap items-center gap-8 text-xs font-mono text-[#555a60] uppercase">
              <span>✓ 2 to 8 Managers</span>
              <span>✓ 4 Overseas Cap</span>
              <span>✓ WhatsApp 1-Click Link</span>
              <span>✓ 100% Free</span>
            </div>
          </div>

          {/* Right: The Tactile Live Auction Paddle (Layered Depth & Bevels) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-white border border-black/10 rounded-2xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_24px_rgba(0,0,0,0.05),0_24px_48px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] flex flex-col relative transition-all">
              
              {/* Top hairline sheen highlight */}
              <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />

              {/* Auction Block Status */}
              <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#555a60]">
                  LOT #{activePlayer.id} • ON THE BLOCK
                </span>
                <span className="text-[11px] font-mono font-bold text-[#124032] uppercase">
                  60s Gavel Window
                </span>
              </div>

              {/* Player Identity */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 min-w-[64px] min-h-[64px] aspect-square rounded-xl bg-gradient-to-b from-[#f8f6f0] to-[#eae6dc] border border-black/10 overflow-hidden flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                  {activePlayer.imageUrl ? (
                    <Image
                      src={activePlayer.imageUrl}
                      alt={activePlayer.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className={`text-xl font-bold text-[#124032] ${displayFont.className}`}>
                      {activePlayer.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#555a60]">
                    <span>{activePlayer.flag}</span>
                    <span>{activePlayer.country}</span>
                    <span>•</span>
                    <span className="font-mono">Reserve {activePlayer.reserve}</span>
                  </div>
                  <h3 className={`text-2xl font-bold uppercase tracking-tight truncate text-[#121417] mt-0.5 ${displayFont.className}`}>
                    {activePlayer.name}
                  </h3>
                  <p className="text-xs text-[#555a60] truncate">
                    {activePlayer.role}
                  </p>
                </div>
              </div>

              {/* Recessed Player Stats Well */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-[#faf9f5] border border-black/10 rounded-xl text-center mb-5 font-mono text-xs shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                <div>
                  <span className="text-[10px] text-[#767c84] block">MATCHES</span>
                  <span className="font-bold text-[#121417]">{activePlayer.stats?.matches || 120}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#767c84] block">{activePlayer.stats?.runs ? "RUNS" : "WKTS"}</span>
                  <span className="font-bold text-[#121417]">{activePlayer.stats?.runs || activePlayer.stats?.wickets || 140}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#767c84] block">{activePlayer.stats?.sr ? "SR" : "ECON"}</span>
                  <span className="font-bold text-[#124032]">{activePlayer.stats?.sr || activePlayer.stats?.economy || 7.8}</span>
                </div>
              </div>

              {/* Embossed / Debossed High Bid Plaque */}
              <div className="text-center py-4 px-3 bg-gradient-to-b from-[#f8f6f0] to-[#f0ece2] rounded-xl border border-black/10 mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_1px_2px_rgba(255,255,255,0.8)]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#767c84] block mb-1">
                  CURRENT HIGH BID
                </span>
                <span className={`text-4xl sm:text-5xl font-bold text-[#121417] tracking-tight block ${displayFont.className}`}>
                  ₹{(currentBid / 100).toFixed(2)} CR
                </span>
                <span className="text-xs font-mono text-[#555a60] block mt-1">
                  Held by <strong className="text-[#121417]">{leader}</strong>
                </span>
              </div>

              {/* The Physical Bidding Paddle Button (3D Bottom Edge & Press) */}
              <button
                onClick={handleRaisePaddle}
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border active:translate-y-1 ${
                  isPaddleRaised
                    ? "bg-[#09231a] text-white border-black translate-y-1 shadow-none"
                    : "bg-[#124032] hover:bg-[#0e3529] text-white border-[#0e3529] shadow-[0_4px_0_#071d15,0_10px_20px_rgba(18,64,50,0.2)] hover:shadow-[0_3px_0_#071d15,0_6px_14px_rgba(18,64,50,0.18)]"
                }`}
              >
                <span>Raise Paddle (+₹50 Lakhs)</span>
              </button>

              {/* Live Bid Ledger */}
              <div className="mt-4 pt-3 border-t border-black/10 space-y-1.5 text-xs font-mono">
                {bidLog.map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-[#555a60]">
                    <span className="truncate">{log.team} raised to {log.amount}</span>
                    <span className="text-[10px] text-[#767c84] shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. KEY MARQUEE PLAYERS (HEADLINERS ONLY WITH TACTILE DEPTH)
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-black/10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#124032] block mb-1">
              KEY SUPERSTARS
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#121417] ${displayFont.className}`}>
              Marquee Headliners
            </h2>
            <p className="text-sm text-[#555a60] mt-1">
              Click any star below to nominate them directly onto the live auction paddle above.
            </p>
          </div>

          <div className="text-xs font-mono text-[#555a60]">
            Spotlight: 8 Superstars • <span className="text-[#124032] font-bold">+102 more in draft room</span>
          </div>
        </div>

        {/* Elevated 8-Player Card Grid (Tactile Shadows & Hover Lift) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KEY_PLAYERS.map((player) => {
            const isSelected = selectedPlayerId === player.id;

            return (
              <div
                key={player.id}
                onClick={() => handleSelectPlayer(player)}
                className={`p-5 bg-white rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? "border-black bg-[#faf8f3] shadow-[0_4px_12px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.08)] ring-2 ring-black/15 -translate-y-1"
                    : "border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-black/30"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#555a60] mb-2">
                    <span className="flex items-center gap-1.5">
                      <span>{player.flag}</span>
                      <span>{player.team}</span>
                    </span>
                    <span className="font-bold text-[#121417] bg-[#f4f2ec] px-2 py-0.5 rounded border border-black/5">
                      OVR {player.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="relative w-12 h-12 min-w-[48px] min-h-[48px] aspect-square rounded-xl bg-gradient-to-b from-[#f8f6f0] to-[#ede9df] border border-black/10 overflow-hidden flex items-center justify-center shrink-0 shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] group-hover:scale-105 transition-transform">
                      {player.imageUrl ? (
                        <Image
                          src={player.imageUrl}
                          alt={player.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className={`text-base font-bold text-[#124032] ${displayFont.className}`}>
                          {player.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className={`text-lg font-bold uppercase tracking-tight text-[#121417] truncate group-hover:text-[#124032] transition-colors ${displayFont.className}`}>
                        {player.name}
                      </h4>
                      <span className="text-xs text-[#555a60] block truncate">
                        {player.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#555a60]">{player.reserve} Base</span>
                  <span className={`font-bold ${isSelected ? "text-[#124032]" : "text-[#767c84] group-hover:text-[#121417]"}`}>
                    {isSelected ? "On Block ★" : "Nominate ➝"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. THE 8 FRANCHISE DIRECTORY (ELEVATED ARCHITECTURAL CARDS)
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-black/10">
        <div className="text-left mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#124032] block mb-1">
            FRANCHISE SELECTION
          </span>
          <h2 className={`text-3xl sm:text-4xl font-bold uppercase tracking-tight text-[#121417] ${displayFont.className}`}>
            The 8 War Rooms
          </h2>
          <p className="text-sm text-[#555a60] mt-1">
            Each manager takes one franchise. Strict ₹100 Crore purse cap. 11-player squad.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              onClick={onOpenPrivateModal}
              className="p-5 bg-white border border-black/10 hover:border-black/30 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px] group shadow-[0_2px_4px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_12px_rgba(0,0,0,0.04),0_16px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#121417] bg-[#f7f5ef] px-2 py-0.5 rounded border border-black/5">
                    {team.code}
                  </span>
                  <span className="text-[10px] font-mono text-[#767c84] uppercase">
                    {team.titles}
                  </span>
                </div>
                <h3 className={`text-xl font-bold uppercase text-[#121417] group-hover:text-[#124032] transition-colors ${displayFont.className}`}>
                  {team.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono">
                <span className="text-[#555a60]">Purse: ₹{team.purse} Cr</span>
                <span className="text-[#124032] font-bold group-hover:translate-x-0.5 transition-transform">Claim ➝</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW TO DRAFT (ELEVATED 3-STEP TILES)
          ───────────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-black/10 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.03)]">
            <span className={`text-5xl font-bold text-black/15 block mb-2 ${displayFont.className}`}>
              01
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-[#121417] mb-1">
              Create The Room
            </h4>
            <p className="text-xs text-[#555a60] leading-relaxed">
              Host picks 2, 4, 6, or 8 franchises. One tap shares your room PIN and instant WhatsApp link.
            </p>
          </div>

          <div className="p-6 bg-white border border-black/10 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.03)]">
            <span className={`text-5xl font-bold text-black/15 block mb-2 ${displayFont.className}`}>
              02
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-[#121417] mb-1">
              Live Bidding War
            </h4>
            <p className="text-xs text-[#555a60] leading-relaxed">
              Players appear on the block. Raise paddles in increments of ₹5L to ₹50L. 15s anti-sniping protection.
            </p>
          </div>

          <div className="p-6 bg-white border border-black/10 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02),0_6px_16px_rgba(0,0,0,0.03)]">
            <span className={`text-5xl font-bold text-black/15 block mb-2 ${displayFont.className}`}>
              03
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-[#121417] mb-1">
              Deploy Starting XI
            </h4>
            <p className="text-xs text-[#555a60] leading-relaxed">
              Field 11 players on the 2D pitch. Obey the 4 overseas player cap. Assign Captain (2x) and Vice-Captain (1.5x).
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLEAN FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className="px-6 lg:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#767c84] font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#121417]">V-RUN 11</span>
          <span>•</span>
          <span>IPL Fantasy Draft Night</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onOpenPrivateModal} className="hover:text-black transition-colors cursor-pointer">
            Create Room
          </button>
          <button onClick={onOpenJoinCodeModal} className="hover:text-black transition-colors cursor-pointer">
            Join with PIN
          </button>
          <span>100% Free & Open</span>
        </div>
      </footer>

    </div>
  );
}
