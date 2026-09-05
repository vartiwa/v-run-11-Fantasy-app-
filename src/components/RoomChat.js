"use client";

import { useState, useRef, useEffect } from "react";
import { Oswald } from "next/font/google";

const oswald = Oswald({ subsets: ["latin"], weight: ["600"] });

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
    <div className="relative bg-gradient-to-b from-[#183d2f] via-[#133226] to-[#0e271e] border border-[#3dd9a5]/35 rounded-3xl overflow-hidden flex flex-col h-full select-none shadow-[0_16px_36px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] ring-1 ring-[#d4be8c]/25 text-white">
      {/* Top Hairline Sheen */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4be8c]/50 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="bg-[#10271f] px-4 py-2.5 border-b border-white/15 flex items-center justify-between">
        <span className={`text-xs font-bold uppercase tracking-wider text-[#ebd7aa] ${oswald.className}`}>
          War Room Dispatch & Banter
        </span>
        <span className="text-[10px] text-white/70 font-mono bg-[#0d221a] px-2 py-0.5 rounded-md border border-[#3dd9a5]/25 shadow-xs">
          {messages.length} notes
        </span>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-0 bg-[#0e241c]/90 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/50 text-xs py-6 font-mono italic">
            <p>War room telegraph is silent</p>
            <p className="text-[10px] text-white/40 mt-0.5 not-italic">Send an encrypted dispatch to all managers</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender === currentManager;

            return (
              <div
                key={msg.id || msg.timestamp}
                className={`flex flex-col text-xs ${isMe ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono">
                  <span className="font-bold text-[#ebd7aa]">
                    {msg.sender}
                  </span>
                  <span className="text-[#3dd9a5]/90">({msg.franchise})</span>
                  <span className="text-white/40">{msg.time}</span>
                </div>

                <div
                  className={`px-3.5 py-2 rounded-2xl max-w-[85%] text-xs font-medium shadow-xs ${
                    isMe
                      ? "bg-gradient-to-b from-[#1f5c48] to-[#123b2e] text-white rounded-br-xs border border-[#3dd9a5]/50"
                      : "bg-[#122e23] text-white/95 border border-white/15 rounded-bl-xs"
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
      <div className="p-2.5 border-t border-white/15 bg-[#10271f] flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send telegraph dispatch to floor..."
          maxLength={150}
          className="flex-1 bg-[#0d221a] text-xs px-3.5 py-2.5 rounded-xl border border-[#3dd9a5]/30 focus:outline-none focus:border-[#3dd9a5] text-white placeholder:text-white/40 shadow-inner"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isCooldown}
          className="px-4 py-2.5 bg-gradient-to-b from-[#215a45] via-[#164635] to-[#0e2e23] hover:from-[#2a6d54] hover:to-[#133d2f] disabled:opacity-40 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer border border-[#3dd9a5]/40 border-b-2 border-b-[#091b14] shadow-xs active:translate-y-0.5 active:border-b-0"
        >
          Send
        </button>
      </div>
    </div>
  );
}
