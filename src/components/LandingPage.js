"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { Inter, Oswald } from "next/font/google";
import {
  ArrowRight,
  Lock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Eye,
  Maximize2,
  Minimize2,
  Crop,
  ZoomIn,
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

  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoBrightness, setVideoBrightness] = useState("vivid"); // "vivid" (100%) | "cinematic" (70%)
  const [isFullPageVideo, setIsFullPageVideo] = useState(false);
  const [videoFit, setVideoFit] = useState("contain"); // "contain" (default, full uncropped video) | "cover" (fill)
  const [zoomScale, setZoomScale] = useState(100); // 100%, 90%, 80%

  const cycleZoom = () => {
    if (zoomScale === 100) setZoomScale(90);
    else if (zoomScale === 90) setZoomScale(80);
    else setZoomScale(100);
  };

  // Guarantee browser autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const onFirstInteraction = () => {
            if (videoRef.current) {
              videoRef.current.play();
              setIsVideoPlaying(true);
            }
            window.removeEventListener("click", onFirstInteraction);
            window.removeEventListener("touchstart", onFirstInteraction);
          };
          window.addEventListener("click", onFirstInteraction, { once: true });
          window.addEventListener("touchstart", onFirstInteraction, { once: true });
        });
      }
    }
  }, []);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const activePlayer = useMemo(() => {
    return KEY_PLAYERS.find((p) => p.id === selectedPlayerId) || KEY_PLAYERS[0];
  }, [selectedPlayerId]);

  const handleRaisePaddle = () => {
    if (soundEnabled) {
      if (typeof sounds.playBid === "function") sounds.playBid();
      else if (typeof sounds.bid === "function") sounds.bid();
    }
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
    <div className={`w-full min-h-screen text-white flex flex-col selection:bg-[#d4be8c] selection:text-[#071510] ${bodyFont.className} ${isFullPageVideo ? "bg-black/40" : "bg-[#040c08]"}`}>
      
      {/* ─────────────────────────────────────────────────────────────
          1. EDITORIAL TOP BAR (DARK GLASS)
          ───────────────────────────────────────────────────────────── */}
      <header className="w-full border-b border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between bg-[#06110c]/85 backdrop-blur-xl sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.25)] text-white">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            <span className={`text-xl font-bold tracking-tighter uppercase text-white ${displayFont.className}`}>
              V-RUN 11
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-white/60 uppercase tracking-wider pl-6 border-l border-white/15">
            IPL Mega Auction Simulator • ₹100 Cr Salary Cap
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 border border-white/15 rounded-xl px-3 py-1.5 text-xs bg-white/5 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
            <span className="font-mono text-[11px] text-white/50 uppercase">ROOM:</span>
            <input
              type="text"
              maxLength={6}
              placeholder="CODE"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
              className="w-16 bg-transparent font-mono font-bold uppercase focus:outline-none text-white placeholder-white/40"
            />
            <button
              onClick={onOpenJoinCodeModal}
              className="text-[11px] font-bold uppercase tracking-wider text-[#d4be8c] hover:text-[#f2e6cb] transition-colors cursor-pointer"
            >
              Join
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-white/70 hover:text-white rounded-xl border border-white/15 hover:border-white/30 bg-white/5 backdrop-blur-md transition-all shadow-sm cursor-pointer active:scale-95"
            title={soundEnabled ? "Mute audio" : "Unmute audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPrivateModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4be8c] to-[#c2aa75] hover:from-[#e0cb9b] hover:to-[#ceb681] text-[#071510] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_2px_0_#8f7a4b,0_6px_14px_rgba(212,190,140,0.25)] active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Host Draft</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. THE EDITORIAL HERO: CINEMATIC VIDEO BACKGROUND + TACTILE PADDLE
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#050e0a] border-b border-black/10">
        
        {/* Background Video Layer with Zero-Crop Fitting */}
        <div
          className={`${
            isFullPageVideo
              ? "fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
              : "absolute inset-0 z-0 pointer-events-none overflow-hidden select-none flex items-center justify-center"
          }`}
        >
          {/* Subtle Ambient Radial Stadium Glow behind the video */}
          <div className="absolute inset-0 bg-[#050e0a] bg-[radial-gradient(ellipse_at_center,rgba(18,64,50,0.4)_0%,rgba(5,14,10,0.95)_75%,#000000_100%)]" />

          {/* Video Container with Dynamic Scale & Fit (No cut, No over-zoom) */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              style={{
                transform: `scale(${zoomScale / 100})`,
                transformOrigin: "center center",
              }}
              className={`w-full h-full transition-all duration-300 ${
                videoFit === "contain"
                  ? "object-contain object-center"
                  : "object-cover object-center"
              } ${
                videoBrightness === "vivid"
                  ? "opacity-100 brightness-105 contrast-105"
                  : "opacity-75 brightness-95"
              }`}
            >
              <source src="/animo-grid-zoom-strip-900p.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Minimal, High-Clarity Contrast Veil: Video is 100% Clearly Visible */}
          <div
            className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${
              videoBrightness === "vivid" ? "bg-black/20" : "bg-black/45"
            }`}
          />
          {/* Subtle lateral vignette for text legibility without dimming or cutting video */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/35 pointer-events-none" />

          {/* Ultra-slim bottom hairline fade instead of 128px overlay so bottom is NOT cut off */}
          {!isFullPageVideo && (
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent to-[#fcfbf9]/50 pointer-events-none" />
          )}
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 px-6 lg:px-12 pt-12 pb-20 lg:pt-20 lg:pb-28 max-w-7xl mx-auto w-full">
          
          {/* Top Status Bar with Visibility, Fit, Zoom & Motion Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/20 text-[#d4be8c] text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
              <span>Real-Time Multiplayer Auction for Friends</span>
            </div>

            {/* Video Controls Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Fit Mode Toggle: No Cut vs Fill */}
              <button
                onClick={() => setVideoFit(videoFit === "contain" ? "cover" : "contain")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[11px] font-mono text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                title={videoFit === "contain" ? "Currently Uncropped (Fit 100%). Click for Full Screen Fill." : "Currently Filling Screen. Click for Uncropped Fit."}
              >
                <Crop className="w-3.5 h-3.5 text-[#d4be8c]" />
                <span>{videoFit === "contain" ? "Fit: Full (No Cut)" : "Fit: Fill Screen"}</span>
              </button>

              {/* Zoom Scale Adjuster */}
              <button
                onClick={cycleZoom}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[11px] font-mono text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                title="Adjust video scale (100% / 90% / 80%)"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#d4be8c]" />
                <span>Zoom: {zoomScale}%</span>
              </button>

              {/* Visibility / Brightness Toggle */}
              <button
                onClick={() => setVideoBrightness(videoBrightness === "vivid" ? "cinematic" : "vivid")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[11px] font-mono text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                title="Toggle video brightness and visibility"
              >
                <Eye className="w-3.5 h-3.5 text-[#d4be8c]" />
                <span>{videoBrightness === "vivid" ? "100% Vivid" : "75% Soft"}</span>
              </button>

              {/* Full Page vs Hero Scope Toggle */}
              <button
                onClick={() => setIsFullPageVideo(!isFullPageVideo)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[11px] font-mono text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                title="Toggle between Hero section background and Full-Page background"
              >
                {isFullPageVideo ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-[#d4be8c]" />
                    <span>Hero Only</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#d4be8c]" />
                    <span>Full Page BG</span>
                  </>
                )}
              </button>

              {/* Video Motion Control Toggle */}
              <button
                onClick={toggleVideoPlay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-[11px] font-mono text-white/90 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-95"
                title={isVideoPlaying ? "Pause ambient video motion" : "Resume ambient video motion"}
              >
                {isVideoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#d4be8c]" />
                    <span className="hidden sm:inline">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-white/70" />
                    <span className="hidden sm:inline">Play</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Pure Typographic Statement */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.9] text-white mb-6 drop-shadow-sm ${displayFont.className}`}>
                The Cricket <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4be8c] via-[#f7ecd5] to-[#d4be8c]">
                  Auction.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#d8e0db] leading-relaxed max-w-xl mb-8 font-normal drop-shadow">
                ₹100 Crore purse. Official IPL rules. Anti-sniping gavel clock. Field your 11-player squad on the 2D pitch. Zero app downloads, zero logins.
              </p>

              {/* Clear, Tactile Actions */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenPrivateModal}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#d4be8c] to-[#c7ad72] hover:from-[#dfca95] hover:to-[#d0b87f] text-[#071510] text-sm font-bold uppercase tracking-wider transition-all shadow-[0_4px_0_#8a7647,0_12px_24px_rgba(212,190,140,0.25)] active:translate-y-1 active:shadow-none cursor-pointer flex items-center gap-2 font-mono"
                >
                  <span>Create Private Draft Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onQuickJoin}
                  className="px-6 py-4 rounded-xl border border-white/20 hover:border-white/40 text-white hover:bg-white/10 text-sm font-bold uppercase tracking-wider transition-all bg-white/5 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.25)] cursor-pointer active:translate-y-0.5 font-mono"
                >
                  Instant Demo Table
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/15 w-full flex flex-wrap items-center gap-8 text-xs font-mono text-[#b8c7c0] uppercase">
                <span className="flex items-center gap-1.5"><strong className="text-[#d4be8c]">✓</strong> 2 to 8 Managers</span>
                <span className="flex items-center gap-1.5"><strong className="text-[#d4be8c]">✓</strong> 4 Overseas Cap</span>
                <span className="flex items-center gap-1.5"><strong className="text-[#d4be8c]">✓</strong> WhatsApp 1-Click Link</span>
                <span className="flex items-center gap-1.5"><strong className="text-[#d4be8c]">✓</strong> 100% Free</span>
              </div>
            </div>

            {/* Right: The Tactile Live Auction Paddle (Layered Depth & Bevels) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08]/95 backdrop-blur-xl border border-[#d4be8c]/25 rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(18,64,50,0.35)] ring-1 ring-[#d4be8c]/20 flex flex-col relative transition-all text-white">
              
              {/* Top hairline sheen highlight */}
              <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent" />

              {/* Auction Block Status */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#d4be8c] font-semibold">
                  LOT #{activePlayer.id} • ON THE BLOCK
                </span>
                <span className="text-[11px] font-mono font-bold text-[#34d399] uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                  <span>60s Gavel Window</span>
                </span>
              </div>

              {/* Player Identity */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16 min-w-[64px] min-h-[64px] aspect-square rounded-2xl bg-gradient-to-b from-[#124032] to-[#081b14] border border-[#d4be8c]/30 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                  {activePlayer.imageUrl ? (
                    <Image
                      src={activePlayer.imageUrl}
                      alt={activePlayer.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className={`text-xl font-bold text-[#d4be8c] ${displayFont.className}`}>
                      {activePlayer.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-white/60">
                    <span>{activePlayer.flag}</span>
                    <span>{activePlayer.country}</span>
                    <span>•</span>
                    <span className="font-mono text-[#d4be8c]">Reserve {activePlayer.reserve}</span>
                  </div>
                  <h3 className={`text-2xl font-bold uppercase tracking-tight truncate text-white mt-0.5 ${displayFont.className}`}>
                    {activePlayer.name}
                  </h3>
                  <p className="text-xs text-white/60 truncate">
                    {activePlayer.role}
                  </p>
                </div>
              </div>

              {/* Recessed Player Stats Well */}
              <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-white/5 border border-white/10 rounded-2xl text-center mb-5 font-mono text-xs shadow-inner">
                <div>
                  <span className="text-[10px] text-white/40 block">MATCHES</span>
                  <span className="font-bold text-white">{activePlayer.stats?.matches || 120}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">{activePlayer.stats?.runs ? "RUNS" : "WKTS"}</span>
                  <span className="font-bold text-white">{activePlayer.stats?.runs || activePlayer.stats?.wickets || 140}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 block">{activePlayer.stats?.sr ? "SR" : "ECON"}</span>
                  <span className="font-bold text-[#34d399]">{activePlayer.stats?.sr || activePlayer.stats?.economy || 7.8}</span>
                </div>
              </div>

              {/* Embossed / Debossed High Bid Plaque */}
              <div className="text-center py-4 px-3 bg-gradient-to-b from-[#124032]/60 to-[#071912]/80 rounded-2xl border border-[#d4be8c]/30 mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4be8c] block mb-1">
                  CURRENT HIGH BID
                </span>
                <span className={`text-4xl sm:text-5xl font-bold tracking-tight block text-transparent bg-clip-text bg-gradient-to-r from-[#d4be8c] via-[#f7ecd5] to-[#d4be8c] ${displayFont.className}`}>
                  ₹{(currentBid / 100).toFixed(2)} CR
                </span>
                <span className="text-xs font-mono text-white/60 block mt-1">
                  Held by <strong className="text-white">{leader}</strong>
                </span>
              </div>

              {/* The Physical Bidding Paddle Button (3D Bottom Edge & Press) */}
              <button
                onClick={handleRaisePaddle}
                className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border active:translate-y-1 font-mono ${
                  isPaddleRaised
                    ? "bg-[#bda46d] text-[#071510] border-[#927d4d] translate-y-1 shadow-none"
                    : "bg-gradient-to-r from-[#d4be8c] via-[#ecdcb8] to-[#d4be8c] hover:from-[#e2ce9f] hover:to-[#dfc896] text-[#071510] border-[#d4be8c] shadow-[0_4px_0_#9a8455,0_12px_24px_rgba(212,190,140,0.3)] hover:shadow-[0_3px_0_#9a8455,0_8px_18px_rgba(212,190,140,0.25)]"
                }`}
              >
                <span>Raise Paddle (+₹50 Lakhs)</span>
              </button>

              {/* Live Bid Ledger */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                {bidLog.map((log, i) => (
                  <div key={i} className="flex justify-between items-center text-white/70">
                    <span className="truncate">{log.team} raised to {log.amount}</span>
                    <span className="text-[10px] text-white/40 shrink-0">{log.time}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. KEY MARQUEE PLAYERS (HEADLINERS ONLY WITH TACTILE DEPTH)
          ───────────────────────────────────────────────────────────── */}
      <section className={`px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-white/10 relative z-10 transition-colors duration-300 ${isFullPageVideo ? "bg-[#06120d]/75 backdrop-blur-md" : ""}`}>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124032]/80 border border-[#d4be8c]/35 text-[#d4be8c] text-[11px] font-mono tracking-wider uppercase backdrop-blur-md mb-2.5 shadow-sm">
              KEY SUPERSTARS
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white ${displayFont.className}`}>
              Marquee Headliners
            </h2>
            <p className="text-sm text-white/60 mt-1">
              Click any star below to nominate them directly onto the live auction paddle above.
            </p>
          </div>

          <div className="text-xs font-mono text-white/60">
            Spotlight: 8 Superstars • <span className="text-[#d4be8c] font-bold">+102 more in draft room</span>
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
                className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group overflow-hidden ${
                  isSelected
                    ? "bg-gradient-to-b from-[#124032] via-[#0d2e24] to-[#071912] border-[#d4be8c] shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_30px_rgba(212,190,140,0.3),inset_0_1px_0_rgba(212,190,140,0.4)] ring-2 ring-[#d4be8c]/70 -translate-y-1"
                    : "bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border-white/10 hover:border-[#d4be8c]/60 hover:bg-[#0c2018] shadow-[0_10px_25px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_25px_rgba(18,64,50,0.35),inset_0_1px_0_rgba(212,190,140,0.25)] hover:-translate-y-1"
                }`}
              >
                {/* Top ambient hairline sheen */}
                <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/40 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                    <span className="flex items-center gap-1.5">
                      <span>{player.flag}</span>
                      <span>{player.team}</span>
                    </span>
                    <span className="font-bold text-[#d4be8c] bg-[#124032] px-2 py-0.5 rounded border border-[#d4be8c]/30 shadow-inner">
                      OVR {player.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="relative w-12 h-12 min-w-[48px] min-h-[48px] aspect-square rounded-xl bg-gradient-to-b from-[#124032] to-[#081b14] border border-[#d4be8c]/35 overflow-hidden flex items-center justify-center shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)] group-hover:scale-105 transition-transform">
                      {player.imageUrl ? (
                        <Image
                          src={player.imageUrl}
                          alt={player.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <span className={`text-base font-bold text-[#d4be8c] ${displayFont.className}`}>
                          {player.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className={`text-lg font-bold uppercase tracking-tight text-white truncate group-hover:text-[#d4be8c] transition-colors ${displayFont.className}`}>
                        {player.name}
                      </h4>
                      <span className="text-xs text-white/60 block truncate">
                        {player.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-white/60">{player.reserve} Base</span>
                  <span className={`font-bold transition-colors ${isSelected ? "text-[#d4be8c]" : "text-white/50 group-hover:text-[#d4be8c]"}`}>
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
      <section className={`px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-white/10 relative z-10 transition-colors duration-300 ${isFullPageVideo ? "bg-[#06120d]/75 backdrop-blur-md" : ""}`}>
        <div className="text-left mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#124032]/80 border border-[#d4be8c]/35 text-[#d4be8c] text-[11px] font-mono tracking-wider uppercase backdrop-blur-md mb-2.5 shadow-sm">
            FRANCHISE SELECTION
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white ${displayFont.className}`}>
            The 8 War Rooms
          </h2>
          <p className="text-sm text-white/60 mt-1">
            Each manager takes one franchise. Strict ₹100 Crore purse cap. 11-player squad.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TEAMS.map((team) => (
            <div
              key={team.id}
              onClick={onOpenPrivateModal}
              className="relative p-5 bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-white/10 hover:border-[#d4be8c]/60 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[145px] group shadow-[0_10px_25px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_25px_rgba(212,190,140,0.2),inset_0_1px_0_rgba(212,190,140,0.25)] hover:-translate-y-1 overflow-hidden"
            >
              {/* Top ambient hairline sheen */}
              <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/35 to-transparent pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#d4be8c] bg-[#124032] px-2 py-0.5 rounded border border-[#d4be8c]/30 shadow-inner">
                    {team.code}
                  </span>
                  <span className="text-[10px] font-mono text-white/50 uppercase">
                    {team.titles}
                  </span>
                </div>
                <h3 className={`text-xl font-bold uppercase text-white group-hover:text-[#d4be8c] transition-colors ${displayFont.className}`}>
                  {team.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-white/60">Purse: ₹{team.purse} Cr</span>
                <span className="text-[#d4be8c] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Claim ➝
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW TO DRAFT (ELEVATED 3-STEP TILES)
          ───────────────────────────────────────────────────────────── */}
      <section className={`px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full border-b border-white/10 relative z-10 transition-colors duration-300 ${isFullPageVideo ? "bg-[#06120d]/75 backdrop-blur-md" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative p-6 bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-white/10 hover:border-[#d4be8c]/35 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.8),0_0_24px_rgba(18,64,50,0.25)] transition-all group overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/30 to-transparent pointer-events-none" />
            <span className={`text-5xl font-bold text-[#d4be8c]/25 group-hover:text-[#d4be8c]/45 transition-colors block mb-2 ${displayFont.className}`}>
              01
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-white mb-1">
              Create The Room
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Host picks 2, 4, 6, or 8 franchises. One tap shares your room PIN and instant WhatsApp link.
            </p>
          </div>

          <div className="relative p-6 bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-white/10 hover:border-[#d4be8c]/35 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.8),0_0_24px_rgba(18,64,50,0.25)] transition-all group overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/30 to-transparent pointer-events-none" />
            <span className={`text-5xl font-bold text-[#d4be8c]/25 group-hover:text-[#d4be8c]/45 transition-colors block mb-2 ${displayFont.className}`}>
              02
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-white mb-1">
              Live Bidding War
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Players appear on the block. Raise paddles in increments of ₹5L to ₹50L. 15s anti-sniping protection.
            </p>
          </div>

          <div className="relative p-6 bg-gradient-to-b from-[#0b1c15]/95 via-[#071510]/95 to-[#040c08] border border-white/10 hover:border-[#d4be8c]/35 rounded-2xl shadow-[0_12px_28px_rgba(0,0,0,0.65),0_2px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_18px_38px_rgba(0,0,0,0.8),0_0_24px_rgba(18,64,50,0.25)] transition-all group overflow-hidden">
            <div className="absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/30 to-transparent pointer-events-none" />
            <span className={`text-5xl font-bold text-[#d4be8c]/25 group-hover:text-[#d4be8c]/45 transition-colors block mb-2 ${displayFont.className}`}>
              03
            </span>
            <h4 className="text-base font-bold uppercase tracking-tight text-white mb-1">
              Deploy Starting XI
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Field 11 players on the 2D pitch. Obey the 4 overseas player cap. Assign Captain (2x) and Vice-Captain (1.5x).
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CLEAN FOOTER
          ───────────────────────────────────────────────────────────── */}
      <footer className={`px-6 lg:px-12 py-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-mono relative z-10 border-t border-white/10 ${isFullPageVideo ? "bg-[#06120d]/75 backdrop-blur-md" : ""}`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">V-RUN 11</span>
          <span>•</span>
          <span>IPL Fantasy Draft Night</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={onOpenPrivateModal} className="hover:text-[#d4be8c] text-white/70 transition-colors cursor-pointer">
            Create Room
          </button>
          <button onClick={onOpenJoinCodeModal} className="hover:text-[#d4be8c] text-white/70 transition-colors cursor-pointer">
            Join with PIN
          </button>
          <span className="text-white/40">100% Free & Open</span>
        </div>
      </footer>

    </div>
  );
}
