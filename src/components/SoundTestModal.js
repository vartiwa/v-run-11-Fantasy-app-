"use client";

import { useState } from "react";
import { Oswald } from "next/font/google";
import { sounds } from "@/lib/soundEffects";
import { SoundSpeakerIcon, AudioEqualizer } from "./AuctionIcons";

const oswald = Oswald({ subsets: ["latin"], weight: ["600", "700"] });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none text-[#121417]">
      <div className="relative w-full max-w-md bg-gradient-to-b from-white via-[#faf8f3] to-[#f4efe3] border border-[#dcd6c8] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dfd2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#185341] to-[#0e3328] text-white flex items-center justify-center shadow-xs">
              <SoundSpeakerIcon isMuted={isMuted} className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold uppercase tracking-wider text-[#121417] leading-none ${oswald.className}`}>
                Subtle Audio Synthesizer
              </h3>
              <p className="text-[11px] font-mono text-[#767c84] mt-0.5">
                Gentle acoustic chimes & wooden mallet feedback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#dcd6c8] text-[#767c84] hover:text-[#121417] flex items-center justify-center text-sm cursor-pointer shadow-2xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Master Mute & Equalizer Status Strip */}
        <div className="flex items-center justify-between my-3 p-3 bg-white rounded-2xl border border-[#ded8cb] shadow-2xs">
          <div className="flex items-center gap-3">
            <AudioEqualizer isMuted={isMuted} />
            <div className="text-xs font-mono">
              <span className="font-bold block text-[#121417]">
                Status: {isMuted ? "Audio Muted" : "Active & Ready"}
              </span>
              <span className="text-[10px] text-[#767c84]">
                {isMuted ? "Turn on audio to hear gentle auction cues" : "Low gain, soft attacks, filtered sine tones"}
              </span>
            </div>
          </div>

          <button
            onClick={onToggleMute}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              isMuted
                ? "bg-[#185341] text-white border-[#185341] shadow-xs"
                : "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100"
            }`}
          >
            {isMuted ? "Unmute Now" : "Mute Sound"}
          </button>
        </div>

        {/* Sound Effects Grid */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {SOUND_EFFECTS.map((item) => {
            const isPlaying = lastTested === item.id;

            return (
              <div
                key={item.id}
                className={`p-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isPlaying
                    ? "bg-[#eef7f2] border-[#7ec499] shadow-xs scale-[1.01]"
                    : "bg-white border-[#e5dfd2] hover:bg-[#faf8f4]"
                }`}
              >
                <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#121417] font-mono leading-tight">{item.label}</p>
                    <p className="text-[10px] text-[#767c84] font-mono truncate">{item.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTest(item)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                    isPlaying
                      ? "bg-[#185341] text-white border-[#1b5e4a] shadow-xs"
                      : "bg-gradient-to-b from-white to-[#f4f1e8] hover:to-[#ece6d8] text-[#121417] border-[#d8d1c0] shadow-2xs active:translate-y-0.5"
                  }`}
                >
                  {isPlaying ? "Playing ♪" : "Test Sound"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 mt-3 border-t border-[#e5dfd2] flex items-center justify-between text-[10px] font-mono text-[#767c84]">
          <span>Filtered sine & acoustic resonance (zero harsh buzz)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#185341] text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
