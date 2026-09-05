"use client";

import { useState, useRef, useEffect } from "react";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"] });

export default function RoomChat({
  messages = [],
  onSendMessage,
  currentManager = "",
  currentFranchise = "",
}) {
  const [inputText, setInputText] = useState("");
  const [isCooldown, setIsCooldown] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isCooldown) return;

    if (text.length > 150) {
      return alert("Message too long (max 150 characters)");
    }

    onSendMessage(text);
    setInputText("");

    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-[#f7faf8] to-[#edf5f0] border border-[#c6ded0] rounded-3xl overflow-hidden flex flex-col h-full select-none shadow-[0_16px_36px_rgba(18,64,50,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-[#059669]/10 text-[#12241b]">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#d4be8c] via-[#059669] to-[#d4be8c] opacity-80" />

      {/* Header */}
      <div className="bg-[#eef5f1] px-4 py-2.5 border-b border-[#cfe0d5] flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider text-[#0f5132] ${outfit.className}`}>
          War Room Dispatch & Banter
        </span>
        <span className="text-[10px] text-[#5c7567] font-mono bg-white px-2 py-0.5 rounded-md border border-[#cbe0d3] shadow-xs">
          {messages.length} notes
        </span>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 bg-[#f8faf8] shadow-inner">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#5c7567] text-xs py-6 font-sans italic">
            <p>War room telegraph is silent</p>
            <p className="text-[10px] text-[#7d9b89] mt-0.5 not-italic">Send a dispatch to all managers</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentManager;

            return (
              <div
                key={msg.id || msg.timestamp}
                className={`flex flex-col text-xs ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-sans">
                  <span className="font-bold text-[#0e2c1e]">
                    {msg.sender}
                  </span>
                  <span className="text-[#047857] font-medium">({msg.franchise})</span>
                  <span className="text-[#7d9b89] font-mono">{msg.time}</span>
                </div>

                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-xs font-medium shadow-xs ${
                    isMe
                      ? "bg-gradient-to-b from-[#e6f7ee] to-[#d4eee0] text-[#0e3524] rounded-br-xs border border-[#a7f3d0]"
                      : "bg-white text-[#12241b] border border-[#cfe2d6] rounded-bl-xs"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Field */}
      <div className="p-2.5 border-t border-[#cfe0d5] bg-[#eef5f1] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send telegraph dispatch to floor..."
          maxLength={150}
          className="flex-1 bg-white text-[#0e2c1e] text-xs px-3.5 py-2.5 rounded-xl border border-[#c4ded0] focus:outline-none focus:border-[#059669] placeholder:text-[#7d9b89] shadow-inner"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isCooldown}
          className="px-4 py-2.5 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] hover:from-[#10b981] hover:to-[#047857] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#34d399]/60 border-b-2 border-b-[#064e3b] shadow-xs active:translate-y-0.5 active:border-b-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
