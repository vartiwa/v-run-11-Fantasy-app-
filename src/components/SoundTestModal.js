"use client";

import { useState } from "react";
import { Outfit } from "next/font/google";
import { sounds } from "@/lib/soundEffects";
import { SoundSpeakerIcon, AudioEqualizer } from "./AuctionIcons";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"] });

const SOUND_EFFECTS = [
  { id: "bid", label: "Bid Chime", icon: "🔔", desc: "Warm, soft harmonic marimba chime when any team bids", action: () => sounds.playBid() },
  { id: "outbid", label: "Outbid Notice", icon: "⚡", desc: "Gentle, polite descending two-tone reminder when outbid", action: () => sounds.playOutbid() },
  { id: "gavel", label: "Gavel Knock", icon: "🔨", desc: "Deep acoustic wooden mallet knock on mahogany block", action: () => sounds.playGavel() },
  { id: "fairWarning", label: "Fair Warning", icon: "⚠️", desc: "3 gentle wooden taps on soundboard (Going twice!)", action: () => sounds.playFairWarning() },
  { id: "tick", label: "Clock Tick", icon: "⏱️", desc: "Subtle, soft clock droplet during final 5 seconds", action: () => sounds.playTick() },
  { id: "victory", label: "Victory Chime", icon: "✨", desc: "Gentle, warm ambient bell arpeggio for winning team", action: () => sounds.playVictory() },
  { id: "unsold", label: "Unsold Note", icon: "🍂", desc: "Subtle, muted wooden drop note when lot passes", action: () => sounds.playUnsold() },
  { id: "click", label: "Paddle Click", icon: "🔘", desc: "Subtle iOS-style haptic micro-tick on paddle press", action: () => sounds.playClick() },
];

export default function SoundTestModal({ isOpen, onClose, isMuted, onToggleMute }) {
  const [lastTested, setLastTested] = useState(null);

  if (!isOpen) return null;

  const handleTest = (item) => {
    item.action();
    setLastTested(item.id);
    setTimeout(() => setLastTested(null), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none text-white">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0b1c15] via-[#071510] to-[#040c08] border border-[#d4be8c]/25 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(18,64,50,0.35)] rounded-3xl p-6 flex flex-col">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#124032]/35 to-transparent pointer-events-none rounded-t-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#124032] to-[#0a231b] border border-[#d4be8c]/40 text-[#d4be8c] flex items-center justify-center shadow-md">
              <SoundSpeakerIcon isMuted={isMuted} className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-lg font-bold uppercase tracking-wider text-white leading-none ${outfit.className}`}>
                Subtle Audio Synthesizer
              </h3>
              <p className="text-[11px] text-white/60 mt-1">
                Gentle acoustic chimes & wooden mallet feedback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Master Mute & Equalizer Status Strip */}
        <div className="relative z-10 flex items-center justify-between my-3.5 p-3.5 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
          <div className="flex items-center gap-3">
            <AudioEqualizer isMuted={isMuted} />
            <div className="text-xs">
              <span className="font-bold block text-white">
                Status: {isMuted ? "Audio Muted" : "Active & Ready"}
              </span>
              <span className="text-[10px] text-white/50">
                {isMuted ? "Turn on audio to hear gentle auction cues" : "Low gain, soft attacks, filtered sine tones"}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleMute}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isMuted
                ? "bg-[#124032] text-[#d4be8c] border-[#d4be8c]/50 shadow-sm"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
            }`}
          >
            {isMuted ? "Unmute Now" : "Mute Sound"}
          </button>
        </div>

        {/* Sound Effects Grid */}
        <div className="relative z-10 space-y-2 max-h-72 overflow-y-auto pr-1">
          {SOUND_EFFECTS.map((item) => {
            const isPlaying = lastTested === item.id;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                  isPlaying
                    ? "bg-[#124032] border-[#d4be8c]/70 shadow-[0_2px_12px_rgba(18,64,50,0.5)] scale-[1.01]"
                    : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
                }`}
              >
                <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white leading-tight">{item.label}</p>
                    <p className="text-[10px] text-white/50 truncate">{item.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTest(item)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                    isPlaying
                      ? "bg-gradient-to-r from-[#d4be8c] to-[#c7ad72] text-[#06120d] border-[#d4be8c] shadow-sm font-semibold"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/15 shadow-sm active:translate-y-0.5"
                  }`}
                >
                  {isPlaying ? "Playing ♪" : "Test Sound"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
          <span>Filtered sine & acoustic resonance</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gradient-to-r from-[#d4be8c] to-[#c7ad72] text-[#06120d] rounded-xl font-bold uppercase tracking-wider cursor-pointer shadow-sm hover:brightness-105"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
